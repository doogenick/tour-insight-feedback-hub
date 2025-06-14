import { v4 as uuidv4 } from 'uuid';
import { api, localforage } from './config';
import { Feedback } from './types';

const feedbackService = {
  // Submit feedback with offline capability
  submitFeedback: async (feedbackData: Omit<Feedback, 'id' | 'status' | 'submitted_at' | 'has_shared_review' | 'tour_end_date' | 'last_review_reminder_sent'>): Promise<{ success: boolean; message: string; data?: Feedback }> => {
    // Generate a UUID for the feedback
    const newFeedback: Feedback = {
      ...feedbackData,
      id: uuidv4(),
      status: 'Pending',
      submitted_at: new Date().toISOString(),
      has_shared_review: false,
      tour_end_date: new Date().toISOString(), // Default to current time, can be overridden
      last_review_reminder_sent: undefined // No reminders sent yet
    };

    // Check if online
    if (navigator.onLine) {
      try {
        const response = await api.post('/feedback/create', newFeedback);
        return { 
          success: true, 
          message: 'Feedback submitted successfully!',
          data: response.data 
        };
      } catch (error) {
        console.error('Error submitting feedback:', error);
        // Store locally if online submission fails
        await localforage.setItem(`feedback_${newFeedback.id}`, newFeedback);
        return { 
          success: true, 
          message: 'Network error - Feedback saved locally and will sync when online.',
          data: newFeedback 
        };
      }
    } else {
      // Store locally if offline
      await localforage.setItem(`feedback_${newFeedback.id}`, newFeedback);
      return { 
        success: true, 
        message: 'You are offline - Feedback saved locally and will sync when online.',
        data: newFeedback 
      };
    }
  },

  // Sync pending feedback items when online
  syncPendingFeedback: async (): Promise<{ synced: number; failed: number }> => {
    if (!navigator.onLine) {
      return { synced: 0, failed: 0 };
    }

    let synced = 0;
    let failed = 0;

    // Get all keys from localforage
    const keys = await localforage.keys();
    const feedbackKeys = keys.filter(key => key.startsWith('feedback_'));

    for (const key of feedbackKeys) {
      try {
        const feedback = await localforage.getItem<Feedback>(key);
        if (feedback && feedback.status === 'Pending') {
          await api.post('/feedback/create', feedback);
          // Mark as synced in local storage
          feedback.status = 'Synced';
          await localforage.setItem(key, feedback);
          synced++;
        }
      } catch (error) {
        console.error(`Failed to sync feedback ${key}:`, error);
        failed++;
      }
    }

    return { synced, failed };
  },

  // Get feedback for a specific tour
  getFeedbackByTour: async (tourId: string): Promise<Feedback[]> => {
    try {
      const response = await api.get(`/feedback/tour/${tourId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching feedback for tour ${tourId}:`, error);
      return [];
    }
  },

  // Get all feedback
  getAllFeedback: async (): Promise<Feedback[]> => {
    try {
      const response = await api.get('/feedback/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all feedback:', error);
      // Fallback to local data if API fails
      const keys = await localforage.keys();
      const feedbackKeys = keys.filter(key => key.startsWith('feedback_'));
      const feedbacks: Feedback[] = [];
      
      for (const key of feedbackKeys) {
        const feedback = await localforage.getItem<Feedback>(key);
        if (feedback) {
          feedbacks.push(feedback);
        }
      }
      
      return feedbacks;
    }
  },

  // Export feedback to CSV
  exportFeedbackToCsv: async (): Promise<Blob> => {
    try {
      const response = await api.get('/feedback/export/csv', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting feedback to CSV:', error);
      throw error;
    }
  },

  // Mark a review as shared on a specific platform
  markReviewAsShared: async (feedbackId: string, platform: 'google' | 'tripadvisor'): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.patch(`/feedback/${feedbackId}/mark-shared`, { platform });
      return { 
        success: true, 
        message: `Successfully marked review as shared on ${platform}` 
      };
    } catch (error) {
      console.error(`Error marking review as shared on ${platform}:`, error);
      return { 
        success: false, 
        message: `Failed to mark review as shared on ${platform}` 
      };
    }
  }
};

export default feedbackService;
