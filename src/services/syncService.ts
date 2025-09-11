import { offlineStorage, OfflineTour, OfflineFeedback } from './offlineStorage';
import { supabase } from '../integrations/supabase/client';
import { useWifiConnection } from '../hooks/useWifiConnection';
// import { validateComprehensiveFeedback, validateTour } from '../schemas/feedbackSchemas';

class SyncService {
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    operationName: string,
    retries: number = this.maxRetries
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error(`❌ ${operationName} failed (attempt ${this.maxRetries - retries + 1}/${this.maxRetries}):`, error);
      
      if (retries > 0) {
        console.log(`⏳ Retrying ${operationName} in ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay);
        return this.retryOperation(operation, operationName, retries - 1);
      }
      
      throw error;
    }
  }

  async syncToSupabase(): Promise<{ success: boolean; message: string; synced: number }> {
    console.log('🔄 Starting sync process...');
    console.log('📱 User agent:', navigator.userAgent);
    console.log('🌐 Network status:', navigator.onLine ? 'online' : 'offline');
    
    try {
      // Test Supabase connection first with retry
      console.log('🔗 Testing Supabase connection...');
      await this.retryOperation(async () => {
        const { data: testData, error: testError } = await supabase
          .from('tours')
          .select('count')
          .limit(1);
        
        if (testError) {
          throw new Error(`Supabase connection failed: ${testError.message}`);
        }
      }, 'Supabase connection test');
      
      console.log('✅ Supabase connection verified, proceeding with sync');
      let syncedCount = 0;
      
      // Get unsynced tours and feedback
      const unsyncedTours = await offlineStorage.getUnsyncedTours();
      const unsyncedFeedback = await offlineStorage.getUnsyncedFeedback();
      
      console.log(`📊 Found ${unsyncedTours.length} unsynced tours and ${unsyncedFeedback.length} unsynced feedback items`);
      
      if (unsyncedTours.length === 0 && unsyncedFeedback.length === 0) {
        console.log('✅ No items to sync');
        return {
          success: true,
          message: 'No items to sync',
          synced: 0
        };
      }

      // Sync tours first
      console.log('🎫 Syncing tours...');
      for (const tour of unsyncedTours) {
        console.log(`📝 Syncing tour: ${tour.tour_code} - ${tour.tour_name}`);
        
        try {
          await this.retryOperation(async () => {
            const tourData = {
              tour_code: tour.tour_code,
              tour_name: tour.tour_name,
              date_start: tour.date_start,
              date_end: tour.date_end,
              passenger_count: tour.passenger_count,
              guide_id: null,
              driver_id: null,
              truck_name: tour.truck_name,
              tour_leader: tour.tour_leader,
              tour_type: 'camping' as const,
              vehicle_name: tour.truck_name,
              crew_count: 2,
              vehicle_type: 'truck',
              status: tour.status
            };
            
            // Validate tour data before syncing
            // const validation = validateTour(tourData);
            // if (!validation.success) {
            //   console.error('❌ Tour validation failed:', validation.errors);
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
              food_rating: feedback.food_rating,
              driving_rating: feedback.driving_rating,
              guiding_rating: feedback.guiding_rating,
              guide_rating: feedback.guide_rating,
              driver_rating: feedback.driver_rating,
              organisation_rating: feedback.organisation_rating,
              guide_individual_rating: feedback.guide_individual_rating,
              driver_individual_rating: feedback.driver_individual_rating,
              pace_rating: feedback.pace_rating,
              route_rating: feedback.route_rating,
              activity_level_rating: feedback.activity_level_rating,
              price_rating: feedback.price_rating,
              value_rating: feedback.value_rating,
              vehicle_rating: feedback.vehicle_rating,
              safety_rating: feedback.safety_rating,
              
              // Guide ratings
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
              highlights: feedback.highlights,
              improvement_suggestions: feedback.improvement_suggestions,
              improvements: feedback.improvements,
              additional_comments: feedback.additional_comments,
              
              // Marketing
              heard_about_source: feedback.heard_about_source,
              heard_about_other: feedback.heard_about_other,
              
              // Personal details
              age: feedback.age,
              gender: feedback.gender,
              newsletter_signup: feedback.newsletter_signup,
              
              // Review preferences
              willing_to_review_google: feedback.willing_to_review_google,
              willing_to_review_tripadvisor: feedback.willing_to_review_tripadvisor,
              
              // Signatures
              client_signature: feedback.client_signature,
              client_signature_date: feedback.client_signature_date,
              crew_signature: feedback.crew_signature,
              signature_data_url: feedback.signature_data_url,
              
              // Status
              status: feedback.status || 'submitted',
              submitted_at: feedback.submitted_at || new Date().toISOString()
            };
            
            // Validate feedback data before syncing
            // const validation = validateComprehensiveFeedback(feedbackData);
            // if (!validation.success) {
            //   console.error('❌ Feedback validation failed:', validation.errors);
            //   throw new Error(`Feedback validation failed: ${validation.errors?.map(e => e.message).join(', ')}`);
            // }
            
            console.log('🚀 Inserting feedback data:', feedbackData);
            
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
        }
      }

      // Update sync status - calculate remaining unsynced items after successful sync
      const remainingTours = await offlineStorage.getUnsyncedTours();
      const remainingFeedback = await offlineStorage.getUnsyncedFeedback();
      const remainingItems = remainingTours.length + remainingFeedback.length;
      
      await offlineStorage.setSyncStatus({
        lastSync: new Date(),
        itemsToSync: remainingItems
      });

      console.log(`🎉 Sync completed successfully! Synced ${syncedCount} items total.`);
      console.log(`📊 Remaining unsynced items: ${remainingItems} (${remainingTours.length} tours + ${remainingFeedback.length} feedback)`);

      return {
        success: true,
        message: `Successfully synced ${syncedCount} items`,
        synced: syncedCount
      };

    } catch (error) {
      console.error('💥 Sync error:', error);
      console.error('Full sync error details:', JSON.stringify(error, null, 2));
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
}

export const syncService = new SyncService();