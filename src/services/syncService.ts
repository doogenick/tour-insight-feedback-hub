import { supabase } from '@/integrations/supabase/client';
import { offlineStorage, OfflineTour, OfflineFeedback } from './offlineStorage';
import { feedbackSupabaseService, tourSupabaseService } from './supabaseServices';

class SyncService {
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  private async retryOperation<T>(
    operation: () => Promise<T>,
    operationName: string,
    retries: number = this.maxRetries
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error(`❌ ${operationName} failed (${retries} retries left):`, error);
      
      if (retries > 0) {
        console.log(`🔄 Retrying ${operationName} in ${this.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retryOperation(operation, operationName, retries - 1);
      }
      
      throw error;
    }
  }

  async syncToSupabase(): Promise<{ success: boolean; message: string; synced: number }> {
    console.log('🔄 Starting sync to Supabase...');
    
    try {
      // Test Supabase connection first with retry
      console.log('🔗 Testing Supabase connection...');
      await this.retryOperation(async () => {
        const { data, error } = await supabase.from('tours').select('id').limit(1);
        if (error) throw error;
      }, 'Connection test');

      // Get unsynced data
      const unsyncedTours = await offlineStorage.getUnsyncedTours();
      const unsyncedFeedback = await offlineStorage.getUnsyncedFeedback();
      
      console.log(`📊 Found ${unsyncedTours.length} unsynced tours and ${unsyncedFeedback.length} unsynced feedback items`);

      let syncedCount = 0;

      // Sync tours first
      console.log('🚌 Syncing tours...');
      for (const tour of unsyncedTours) {
        console.log(`📋 Syncing tour: ${tour.tour_code}`);
        
        try {
          await this.retryOperation(async () => {
            // Map tour data to match Supabase schema
            const tourData = {
              tour_code: tour.tour_code,
              tour_name: tour.tour_name,
              date_start: tour.date_start,
              date_end: tour.date_end,
              passenger_count: tour.passenger_count,
              guide_id: tour.guide_id,
              driver_id: tour.driver_id,
              truck_name: tour.truck_name,
              tour_leader: tour.tour_leader,
              tour_type: tour.tour_type,
              vehicle_name: tour.vehicle_name,
              crew_count: tour.crew_count,
              vehicle_type: tour.vehicle_type,
              status: tour.status,
              feedback_gathering_status: 'active',
              app_version: '1.0.6',
              created_by_client: 'nomad-feedback-mobile'
            };

            // Validate tour data before sending
            // const validation = tourSchema.safeParse(tourData);
            // if (!validation.success) {
            //   throw new Error(`Tour validation failed: ${validation.errors?.map(e => e.message).join(', ')}`);
            // }
            
            console.log('🚀 Inserting tour data:', tourData);
            
            const { data, error } = await supabase
              .from('tours')
              .insert(tourData)
              .select()
              .single();

            if (error) {
              throw new Error(`Tour sync failed: ${error.message}`);
            }

            console.log('✅ Tour synced successfully:', data.id);
            
            // Mark as synced
            await offlineStorage.markTourSynced(tour.offline_id, data.id);
            syncedCount++;

            // Update feedback items with the new tour ID
            const tourFeedback = await offlineStorage.getFeedbackByTour(tour.offline_id);
            console.log(`🔗 Updating ${tourFeedback.length} feedback items with new tour ID`);
            for (const feedback of tourFeedback) {
              feedback.tour_id = data.id;
              await offlineStorage.saveFeedback(feedback);
            }
          }, `Tour sync: ${tour.tour_code}`);

        } catch (err) {
          console.error('❌ Error syncing tour:', err);
          console.error('Full error details:', JSON.stringify(err, null, 2));
        }
      }

      // Sync feedback
      console.log('💬 Syncing feedback...');
      for (const feedback of unsyncedFeedback) {
        console.log(`📋 Syncing feedback from: ${feedback.client_name}`);
        
        try {
          await this.retryOperation(async () => {
            // Check for duplicates before syncing
            if (feedback.tour_id && feedback.client_name && feedback.client_email) {
              const existingFeedback = await feedbackSupabaseService.checkForDuplicateFeedback(
                feedback.tour_id,
                feedback.client_name,
                feedback.client_email
              );
              
              if (existingFeedback) {
                console.log(`⚠️ Duplicate feedback detected for ${feedback.client_name} (${feedback.client_email}). Skipping sync.`);
                // Mark as synced to prevent future attempts
                await offlineStorage.markFeedbackSynced(feedback.offline_id, 'duplicate');
                return;
              }
            }

            // Map feedback data to match Supabase schema exactly
            const feedbackData = {
              tour_id: feedback.tour_id,
              client_name: feedback.client_name,
              client_email: feedback.client_email,
              client_phone: feedback.client_phone || feedback.cellphone,
              client_nationality: feedback.client_nationality || feedback.nationality,
              client_initials: feedback.client_initials,
              tour_section_completed: feedback.tour_section_completed,
              
              // Ratings - use correct field names
              overall_rating: feedback.overall_rating || feedback.overview_rating || 3,
              overview_rating: feedback.overview_rating,
              accommodation_rating: feedback.accommodation_rating,
              information_rating: feedback.information_rating,
              quality_equipment_rating: feedback.quality_equipment_rating,
              truck_comfort_rating: feedback.truck_comfort_rating,
              food_quantity_rating: feedback.food_quantity_rating,
              food_quality_rating: feedback.food_quality_rating,
              driving_rating: feedback.driving_rating,
              guiding_rating: feedback.guiding_rating,
              organisation_rating: feedback.organisation_rating,
              guide_individual_rating: feedback.guide_individual_rating,
              driver_individual_rating: feedback.driver_individual_rating,
              third_crew_rating: feedback.third_crew_rating,
              pace_rating: feedback.pace_rating,
              route_rating: feedback.route_rating,
              activity_level_rating: feedback.activity_level_rating,
              price_rating: feedback.price_rating,
              value_rating: feedback.value_rating,
              
              // Guide detailed ratings
              guide_professionalism: feedback.guide_professionalism,
              guide_organisation: feedback.guide_organisation,
              guide_people_skills: feedback.guide_people_skills,
              guide_enthusiasm: feedback.guide_enthusiasm,
              guide_information: feedback.guide_information,
              
              // Driver ratings
              driver_professionalism: feedback.driver_professionalism,
              driver_organisation: feedback.driver_organisation,
              driver_people_skills: feedback.driver_people_skills,
              driver_enthusiasm: feedback.driver_enthusiasm,
              driver_information: feedback.driver_information,
              
              // Tour leader
              tour_leader_knowledge: feedback.tour_leader_knowledge,
              
              // Satisfaction metrics
              met_expectations: feedback.met_expectations,
              tour_expectations_met: feedback.tour_expectations_met,
              value_for_money: feedback.value_for_money,
              truck_satisfaction: feedback.truck_satisfaction,
              would_recommend: feedback.would_recommend,
              likely_to_return: feedback.likely_to_return,
              repeat_travel: feedback.repeat_travel,
              
              // Comments
              expectations_comment: feedback.expectations_comment,
              value_for_money_comment: feedback.value_for_money_comment,
              truck_satisfaction_comment: feedback.truck_satisfaction_comment,
              tour_leader_knowledge_comment: feedback.tour_leader_knowledge_comment,
              safety_comment: feedback.safety_comment,
              would_recommend_comment: feedback.would_recommend_comment,
              repeat_travel_comment: feedback.repeat_travel_comment,
              
              // Free text
              tour_highlight: feedback.tour_highlight,
              improvement_suggestions: feedback.improvement_suggestions,
              additional_comments: feedback.additional_comments,
              
              // Demographics
              age: feedback.age,
              gender: feedback.gender,
              nationality: feedback.nationality,
              
              // Marketing
              heard_about_source: feedback.heard_about_source,
              heard_about_other: feedback.heard_about_other,
              newsletter_signup: feedback.newsletter_signup,
              
              // Review consent
              willing_to_review_google: feedback.willing_to_review_google,
              willing_to_review_tripadvisor: feedback.willing_to_review_tripadvisor,
              
              // Safety
              safety_rating: feedback.safety_rating,
              
              // Status and metadata
              status: feedback.status || 'submitted',
              submitted_at: feedback.submitted_at || new Date().toISOString(),
              app_version: '1.0.6',
              submitted_by_client: 'nomad-feedback-mobile'
            };

            console.log('🚀 Inserting feedback data for:', feedback.client_name);
            
            const { data, error } = await supabase
              .from('comprehensive_feedback')
              .insert(feedbackData)
              .select()
              .single();

            if (error) {
              throw new Error(`Feedback sync failed: ${error.message}`);
            }

            console.log('✅ Feedback synced successfully:', data.id);
            await offlineStorage.markFeedbackSynced(feedback.offline_id, data.id);
            syncedCount++;
          }, `Feedback sync: ${feedback.client_name}`);

        } catch (err) {
          console.error('❌ Error syncing feedback:', err);
          console.error('Full error details:', JSON.stringify(err, null, 2));
          
          // Check if it's a duplicate constraint error
          if (err && typeof err === 'object' && 'code' in err && err.code === '23505') {
            console.log(`⚠️ Duplicate constraint violation for ${feedback.client_name}. Marking as synced.`);
            await offlineStorage.markFeedbackSynced(feedback.offline_id, 'duplicate');
          }
        }
      }

      console.log(`✅ Sync completed. Synced ${syncedCount} items.`);
      
      return {
        success: true,
        message: `Successfully synced ${syncedCount} items`,
        synced: syncedCount
      };

    } catch (error) {
      console.error('❌ Sync failed:', error);
      return {
        success: false,
        message: `Failed to sync data: ${error.message || 'Unknown error'}`,
        synced: 0
      };
    }
  }

  async getItemsToSync(): Promise<number> {
    try {
      const tours = await offlineStorage.getUnsyncedTours();
      const feedback = await offlineStorage.getUnsyncedFeedback();
      const total = tours.length + feedback.length;
      console.log(`📊 Items to sync: ${tours.length} tours + ${feedback.length} feedback = ${total} total`);
      
      // Update sync status with current count
      await offlineStorage.setSyncStatus({
        lastSync: new Date(),
        itemsToSync: total
      });
      
      return total;
    } catch (error) {
      console.error('Error getting items to sync:', error);
      return 0;
    }
  }

  async syncActiveToursOnly(): Promise<{ success: boolean; message: string }> {
    console.log('🔄 Syncing active tours only...');
    
    try {
      // Get all tours from Supabase with active feedback gathering status
      const { data: activeTours, error: fetchError } = await supabase
        .from('tours')
        .select('id, tour_code, feedback_gathering_status')
        .eq('feedback_gathering_status', 'active');

      if (fetchError) {
        throw new Error(`Failed to fetch active tours: ${fetchError.message}`);
      }

      console.log(`📊 Found ${activeTours?.length || 0} active tours on server`);

      // Get local tours
      const localTours = await offlineStorage.getTours();
      console.log(`📱 Found ${localTours.length} local tours`);

      // Find tours that should be removed (completed on server but still local)
      const activeTourIds = new Set(activeTours?.map(tour => tour.id) || []);
      const toursToRemove = localTours.filter(tour => 
        tour.tour_id && !activeTourIds.has(tour.tour_id)
      );

      console.log(`🗑️ Found ${toursToRemove.length} tours to remove from mobile`);

      // Remove completed tours and their feedback
      for (const tour of toursToRemove) {
        console.log(`🗑️ Removing completed tour: ${tour.tour_code}`);
        
        // Remove associated feedback
        const tourFeedback = await offlineStorage.getFeedbackByTour(tour.offline_id);
        for (const feedback of tourFeedback) {
          await offlineStorage.deleteFeedback(feedback.offline_id);
        }
        
        // Remove tour
        await offlineStorage.deleteTour(tour.offline_id);
      }

      return {
        success: true,
        message: `Refreshed tour data. Removed ${toursToRemove.length} completed tours.`
      };

    } catch (error) {
      console.error('❌ Error syncing active tours:', error);
      return {
        success: false,
        message: `Failed to refresh tour data: ${error.message || 'Unknown error'}`
      };
    }
  }

  async endTourFeedbackGathering(tourId: string): Promise<{ success: boolean; message: string }> {
    console.log(`🔄 Ending feedback gathering for tour ${tourId}...`);
    
    try {
      // First, sync all data for this tour
      await this.syncToSupabase();
      
      // Mark tour as completed in Supabase
      await tourSupabaseService.endFeedbackGathering(tourId);
      
      // Remove tour and its feedback from mobile
      const offlineTours = await offlineStorage.getTours();
      const tourToRemove = offlineTours.find(tour => tour.tour_id === tourId);
      
      if (tourToRemove) {
        await offlineStorage.deleteTour(tourToRemove.offline_id);
        
        // Remove associated feedback
        const tourFeedback = await offlineStorage.getFeedbackByTour(tourToRemove.offline_id);
        for (const feedback of tourFeedback) {
          await offlineStorage.deleteFeedback(feedback.offline_id);
        }
        
        console.log(`🗑️ Removed tour ${tourId} and ${tourFeedback.length} feedback entries from mobile`);
      }
      
      return { 
        success: true, 
        message: `Feedback gathering ended for tour ${tourId}. Data synced and mobile cleaned up.` 
      };
    } catch (error) {
      console.error('❌ Error ending feedback gathering:', error);
      return { 
        success: false, 
        message: `Failed to end feedback gathering: ${error}` 
      };
    }
  }
}

export const syncService = new SyncService();