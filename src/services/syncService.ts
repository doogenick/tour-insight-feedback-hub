import { offlineStorage, OfflineTour, OfflineFeedback } from './offlineStorage';
import { supabase } from '../integrations/supabase/client';
import { useWifiConnection } from '../hooks/useWifiConnection';

class SyncService {
  async syncToSupabase(): Promise<{ success: boolean; message: string; synced: number }> {
    try {
      let syncedCount = 0;
      
      // Get unsynced tours and feedback
      const unsyncedTours = await offlineStorage.getUnsyncedTours();
      const unsyncedFeedback = await offlineStorage.getUnsyncedFeedback();

      // Sync tours first
      for (const tour of unsyncedTours) {
        try {
          const { data, error } = await supabase
            .from('tours')
            .insert({
              tour_code: tour.tour_code,
              tour_name: tour.tour_name,
              date_start: tour.date_start,
              date_end: tour.date_end,
              passenger_count: tour.passenger_count,
              guide_id: null,
              driver_id: null,
              truck_name: tour.truck_name,
              tour_leader: tour.tour_leader,
              tour_type: 'camping',
              vehicle_name: tour.truck_name,
              crew_count: 2,
              vehicle_type: 'truck',
              status: tour.status
            })
            .select()
            .single();

          if (error) {
            console.error('Error syncing tour:', error);
            continue;
          }

          // Mark as synced
          await offlineStorage.markTourSynced(tour.offline_id, data.id);
          syncedCount++;

          // Update feedback items with the new tour ID
          const tourFeedback = await offlineStorage.getFeedbackByTour(tour.offline_id);
          for (const feedback of tourFeedback) {
            feedback.tour_id = data.id;
            await offlineStorage.saveFeedback(feedback);
          }

        } catch (err) {
          console.error('Error syncing tour:', err);
        }
      }

      // Sync feedback
      for (const feedback of unsyncedFeedback) {
        try {
          const { data, error } = await supabase
            .from('comprehensive_feedback')
            .insert({
              tour_id: feedback.tour_id,
              client_name: feedback.client_name,
              client_email: feedback.client_email,
              overall_rating: (feedback as any).overall_rating,
              guide_rating: (feedback as any).guide_rating,
              driver_rating: (feedback as any).driver_rating,
              vehicle_rating: (feedback as any).vehicle_rating,
              accommodation_rating: feedback.accommodation_rating,
              food_rating: (feedback as any).food_rating,
              value_rating: (feedback as any).value_rating,
              would_recommend: feedback.would_recommend,
              newsletter_signup: feedback.newsletter_signup,
              willing_to_review_google: feedback.willing_to_review_google,
              willing_to_review_tripadvisor: feedback.willing_to_review_tripadvisor,
              likely_to_return: (feedback as any).likely_to_return,
              tour_expectations_met: (feedback as any).tour_expectations_met,
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
              pace_rating: feedback.pace_rating,
              route_rating: feedback.route_rating,
              activity_level_rating: feedback.activity_level_rating,
              price_rating: feedback.price_rating,
              overview_rating: feedback.overview_rating,
              guide_professionalism: feedback.guide_professionalism,
              guide_organisation: feedback.guide_organisation,
              guide_people_skills: feedback.guide_people_skills,
              guide_enthusiasm: feedback.guide_enthusiasm,
              guide_information: feedback.guide_information,
              driver_professionalism: feedback.driver_professionalism,
              driver_organisation: feedback.driver_organisation,
              driver_people_skills: feedback.driver_people_skills,
              driver_enthusiasm: feedback.driver_enthusiasm,
              driver_information: feedback.driver_information,
              tour_leader_knowledge: feedback.tour_leader_knowledge,
              safety_rating: feedback.safety_rating,
              met_expectations: feedback.met_expectations,
              value_for_money: feedback.value_for_money,
              additional_comments: feedback.additional_comments,
              improvements: (feedback as any).improvements,
              highlights: (feedback as any).highlights,
              client_phone: (feedback as any).client_phone,
              client_nationality: (feedback as any).client_nationality,
              age: feedback.age,
              gender: feedback.gender
            })
            .select()
            .single();

          if (error) {
            console.error('Error syncing feedback:', error);
            continue;
          }

          await offlineStorage.markFeedbackSynced(feedback.offline_id, data.id);
          syncedCount++;

        } catch (err) {
          console.error('Error syncing feedback:', err);
        }
      }

      // Update sync status
      await offlineStorage.setSyncStatus({
        lastSync: new Date(),
        itemsToSync: (await offlineStorage.getUnsyncedTours()).length + (await offlineStorage.getUnsyncedFeedback()).length
      });

      return {
        success: true,
        message: `Successfully synced ${syncedCount} items`,
        synced: syncedCount
      };

    } catch (error) {
      console.error('Sync error:', error);
      return {
        success: false,
        message: 'Failed to sync data. Please try again.',
        synced: 0
      };
    }
  }

  async getItemsToSync(): Promise<number> {
    const tours = await offlineStorage.getUnsyncedTours();
    const feedback = await offlineStorage.getUnsyncedFeedback();
    return tours.length + feedback.length;
  }
}

export const syncService = new SyncService();