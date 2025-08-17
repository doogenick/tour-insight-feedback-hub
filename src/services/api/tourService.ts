import { dummyDataGenerator } from '../dummyDataGenerator';
import { Tour, Client, ComprehensiveFeedback } from './types';
import { api, localforage } from './config';

export const tourService = {
  // Get upcoming tours
  getUpcomingTours: async (): Promise<Tour[]> => {
    try {
      const response = await api.get('/tours/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming tours:', error);
      
      // Fallback to local data if API fails
      const keys = await localforage.keys();
      const tourKeys = keys.filter(key => key.startsWith('tour_'));
      const tours: Tour[] = [];
      
      for (const key of tourKeys) {
        const tour = await localforage.getItem<Tour>(key);
        if (tour) {
          tours.push(tour);
        }
      }
      
      return tours;
    }
  },
  
  // Get clients for a specific tour
  getTourClients: async (tourId: string): Promise<Client[]> => {
    try {
      const response = await api.get(`/tours/${tourId}/clients`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching clients for tour ${tourId}:`, error);
      
      // Fallback to local data if API fails
      const keys = await localforage.keys();
      const clientKeys = keys.filter(key => key.startsWith('client_'));
      const clients: Client[] = [];
      
      for (const key of clientKeys) {
        const client = await localforage.getItem<Client>(key);
        if (client && client.tour_id === tourId) {
          clients.push(client);
        }
      }
      
      return clients;
    }
  },

  // Generate demo data: tours, clients, and comprehensive feedback
  async generateDemoData(): Promise<{
    tours: Tour[];
    clients: Client[];
    feedback: ComprehensiveFeedback[];
  }> {
    // Use the all-in-one generator for demo
    const { tours, clients, comprehensiveFeedback } =
      await dummyDataGenerator.generateToursAndClients(8);

    // Save a console message for clarity
    console.info('Demo data generated.', {
      toursCount: tours.length,
      clientsCount: clients.length,
      comprehensiveFeedbackCount: comprehensiveFeedback.length,
    });

    return { tours, clients, feedback: comprehensiveFeedback };
  },

  // Reset demo data
  async resetDemoData(): Promise<void> {
    await dummyDataGenerator.clearAllData();
  },

  // Create a new tour
  async createTour(tourData: Omit<Tour, 'tour_id'>): Promise<Tour> {
    try {
      const response = await api.post('/tours', tourData);
      return response.data;
    } catch (error) {
      console.error('Error creating tour:', error);
      
      // Fallback to local storage
      const newTour: Tour = {
        ...tourData,
        tour_id: `local-${Date.now()}`
      };
      await localforage.setItem(`tour_${newTour.tour_id}`, newTour);
      return newTour;
    }
  },

  // Add clients to a tour
  async addClientsToTour(tourId: string, clients: { name: string; email?: string }[]): Promise<Client[]> {
    try {
      const response = await api.post(`/tours/${tourId}/clients`, { clients });
      return response.data;
    } catch (error) {
      console.error('Error adding clients to tour:', error);
      
      // Fallback to local storage
      const newClients: Client[] = clients.map((client, index) => ({
        client_id: `${tourId}-client-${index}`,
        tour_id: tourId,
        full_name: client.name,
        email: client.email || ''
      }));
      
      for (const client of newClients) {
        await localforage.setItem(`client_${client.client_id}`, client);
      }
      
      return newClients;
    }
  },

  // Explicitly download and cache tours and clients for offline use
  async downloadForOffline(): Promise<{ tours: number; clients: number }> {
    let toursCached = 0;
    let clientsCached = 0;

    try {
      // Prefer live API for freshest data
      let tours: Tour[] = [];
      try {
        const response = await api.get('/tours/upcoming');
        tours = response.data;
      } catch {
        tours = await tourService.getUpcomingTours();
      }

      for (const tour of tours) {
        await localforage.setItem(`tour_${tour.tour_id}`, tour);
        toursCached++;

        // Fetch clients per tour and cache
        let clients: Client[] = [];
        try {
          const resp = await api.get(`/tours/${tour.tour_id}/clients`);
          clients = resp.data;
        } catch {
          clients = await tourService.getTourClients(tour.tour_id);
        }

        for (const client of clients) {
          await localforage.setItem(`client_${client.client_id}`, client);
          clientsCached++;
        }
      }
    } catch (err) {
      console.error('Offline download failed:', err);
    }

    return { tours: toursCached, clients: clientsCached };
  }
};
