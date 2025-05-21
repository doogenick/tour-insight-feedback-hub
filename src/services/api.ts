import axios from 'axios';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

// Initialize localforage
localforage.config({
  name: 'tour-feedback-app',
  storeName: 'feedbackData'
});

// Define base URL for API
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-url.com/api' 
  : 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Types for our data models
export interface Tour {
  tour_id: string;
  tour_name: string;
  date_start: string;
  date_end: string;
  passenger_count: number;
}

export interface Client {
  client_id: string;
  tour_id: string;
  full_name: string;
  email?: string;
  willing_to_review_google?: boolean;
  willing_to_review_tripadvisor?: boolean;
  has_reviewed_google?: boolean;
  has_reviewed_tripadvisor?: boolean;
  review_reminder_sent_google?: string;
  review_reminder_sent_tripadvisor?: string;
  created_at?: string;
}

export interface Feedback {
  id: string;
  tour_id: string;
  client_id: string;
  guide_name: string;
  driver_name: string;
  rating_overall: number;
  rating_food?: number;
  rating_equipment?: number;
  comments?: string;
  submitted_at?: string;
  status: 'Pending' | 'Synced';
}

// API service functions
const tourService = {
  // Get upcoming tours
  getUpcomingTours: async (): Promise<Tour[]> => {
    try {
      const response = await api.get('/tours/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming tours:', error);
      return [];
    }
  },

  // Get clients for a specific tour
  getTourClients: async (tourId: string): Promise<Client[]> => {
    try {
      const response = await api.get(`/tours/${tourId}/clients`);
      return response.data.clients;
    } catch (error) {
      console.error(`Error fetching clients for tour ${tourId}:`, error);
      return [];
    }
  },

  // Add new tour
  createTour: async (tourData: Omit<Tour, 'tour_id'>): Promise<Tour> => {
    try {
      const response = await api.post('/tours', tourData);
      return response.data;
    } catch (error) {
      console.error('Error creating tour:', error);
      throw error;
    }
  },

  // Add clients to a tour
  addClientsToTour: async (tourId: string, clients: { full_name: string; email?: string }[]): Promise<Client[]> => {
    try {
      const response = await api.post(`/tours/${tourId}/clients`, { clients });
      return response.data;
    } catch (error) {
      console.error(`Error adding clients to tour ${tourId}:`, error);
      throw error;
    }
  }
};

const feedbackService = {
  // Submit feedback with offline capability
  submitFeedback: async (feedbackData: Omit<Feedback, 'id' | 'status' | 'submitted_at'>): Promise<{ success: boolean; message: string; data?: Feedback }> => {
    // Generate a UUID for the feedback
    const newFeedback: Feedback = {
      ...feedbackData,
      id: uuidv4(),
      status: 'Pending',
      submitted_at: new Date().toISOString()
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

  // Export feedback to CSV
  exportFeedbackToCsv: async (): Promise<Blob> => {
    try {
      const response = await api.get('/feedback/export-csv', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting feedback to CSV:', error);
      throw error;
    }
  }
};

export { tourService, feedbackService };
