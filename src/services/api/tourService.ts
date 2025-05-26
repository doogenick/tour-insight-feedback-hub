import { v4 as uuidv4 } from 'uuid';
import { api, localforage } from './config';
import { Tour, Client, Feedback } from './types';

// Tour service functions
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
    const newTour: Tour = {
      ...tourData,
      tour_id: `TUR${Date.now().toString().slice(-8).toUpperCase()}`,
    };

    try {
      const response = await api.post('/tours', newTour);
      return response.data;
    } catch (error) {
      console.error('Error creating tour:', error);
      // Store locally if API fails
      await localforage.setItem(`tour_${newTour.tour_id}`, newTour);
      return newTour;
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
      // Generate between 8-20 clients per tour
      const clientCount = tour.tour_id === "TAD140525" ? 
        Math.floor(Math.random() * 13) + 8 : // 8-20 clients
        Math.floor(Math.random() * 13) + 8;  // 8-20 clients
      
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

export default tourService;
