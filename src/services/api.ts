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
  guide_name: string;
  driver_name: string;
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
  rating_guide: number;
  rating_driver: number;
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
  },
  
  // Generate demo data for testing
  generateDemoData: async (): Promise<{ tours: Tour[], clients: Client[], feedback: Feedback[] }> => {
    // Sample tours
    const tours: Tour[] = [
      {
        tour_id: "TAD140525",
        tour_name: "Tarangire Adventure",
        date_start: "2025-05-14",
        date_end: "2025-05-20",
        passenger_count: 10,
        guide_name: "Blessing",
        driver_name: "Godfrey"
      },
      {
        tour_id: "ZZK250116R",
        tour_name: "Zanzibar Retreat",
        date_start: "2026-01-25",
        date_end: "2026-02-05",
        passenger_count: 8,
        guide_name: "Zawadi",
        driver_name: "Khamisi"
      }
    ];
    
    // Sample clients
    const firstNames = ["John", "Jane", "Robert", "Mary", "Michael", "Linda", "William", "Patricia", "David", "Jennifer", "Richard", "Elizabeth", "Joseph", "Susan", "Thomas", "Jessica"];
    const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"];
    
    const clients: Client[] = [];
    
    tours.forEach(tour => {
      const clientCount = tour.tour_id === "TAD140525" ? 10 : 8;
      
      for (let i = 0; i < clientCount; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        clients.push({
          client_id: uuidv4(),
          tour_id: tour.tour_id,
          full_name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          willing_to_review_google: Math.random() > 0.5,
          willing_to_review_tripadvisor: Math.random() > 0.5,
          created_at: new Date().toISOString()
        });
      }
    });
    
    // Sample feedback
    const feedback: Feedback[] = [];
    const comments = [
      "Great experience overall! The guide was very knowledgeable.",
      "I enjoyed the tour but the food could have been better.",
      "Excellent service from both the guide and driver.",
      "The equipment was a bit outdated but the tour was still enjoyable.",
      "Amazing tour! Highly recommend.",
      "",
      "Our guide was the highlight of the trip!",
      "The driver was very professional and made us feel safe.",
      "Good experience but would have liked more time at certain attractions.",
      "Overall satisfied with the tour but there's room for improvement."
    ];
    
    // Generate some feedback for half of the clients
    clients.forEach((client, index) => {
      if (index % 2 === 0) {
        const tour = tours.find(t => t.tour_id === client.tour_id)!;
        
        const feedbackEntry: Feedback = {
          id: uuidv4(),
          tour_id: client.tour_id,
          client_id: client.client_id,
          guide_name: tour.guide_name,
          driver_name: tour.driver_name,
          rating_overall: Math.floor(Math.random() * 3) + 3,  // 3-5 rating
          rating_guide: Math.floor(Math.random() * 3) + 3,    // 3-5 rating
          rating_driver: Math.floor(Math.random() * 3) + 3,   // 3-5 rating
          rating_food: Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : undefined,
          rating_equipment: Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : undefined,
          comments: comments[Math.floor(Math.random() * comments.length)],
          submitted_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          status: 'Synced'
        };
        
        feedback.push(feedbackEntry);
      }
    });
    
    // Store demo data in local storage
    for (const tour of tours) {
      await localforage.setItem(`tour_${tour.tour_id}`, tour);
    }
    
    for (const client of clients) {
      await localforage.setItem(`client_${client.client_id}`, client);
    }
    
    for (const feed of feedback) {
      await localforage.setItem(`feedback_${feed.id}`, feed);
    }
    
    return { tours, clients, feedback };
  },
  
  // Reset demo data
  resetDemoData: async (): Promise<void> => {
    const keys = await localforage.keys();
    
    for (const key of keys) {
      await localforage.removeItem(key);
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
