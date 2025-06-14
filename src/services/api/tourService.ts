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
  }
};
