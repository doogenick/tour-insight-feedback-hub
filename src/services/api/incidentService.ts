import { v4 as uuidv4 } from 'uuid';
import { api, localforage } from './config';
import { Incident } from './types';

const incidentService = {
  // Create new incident
  createIncident: async (incidentData: Omit<Incident, 'incident_id' | 'created_at'>): Promise<Incident> => {
    const newIncident: Incident = {
      ...incidentData,
      incident_id: `INC-${incidentData.tour_id}-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    try {
      const response = await api.post('/incidents/create', newIncident);
      return response.data;
    } catch (error) {
      console.error('Error creating incident:', error);
      // Store locally if API fails
      await localforage.setItem(`incident_${newIncident.incident_id}`, newIncident);
      return newIncident;
    }
  },

  // Get incidents for a tour
  getTourIncidents: async (tourId: string): Promise<Incident[]> => {
    try {
      const response = await api.get(`/incidents/tour/${tourId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching incidents for tour ${tourId}:`, error);
      return [];
    }
  },

  // Get all incidents
  getAllIncidents: async (): Promise<Incident[]> => {
    try {
      const response = await api.get('/incidents/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all incidents:', error);
      // Fallback to local data
      const keys = await localforage.keys();
      const incidentKeys = keys.filter(key => key.startsWith('incident_'));
      const incidents: Incident[] = [];
      
      for (const key of incidentKeys) {
        const incident = await localforage.getItem<Incident>(key);
        if (incident) {
          incidents.push(incident);
        }
      }
      
      return incidents;
    }
  },

  // Update incident status
  updateIncidentStatus: async (incidentId: string, status: Incident['status']): Promise<Incident> => {
    try {
      const response = await api.patch(`/incidents/${incidentId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating incident status:', error);
      throw error;
    }
  }
};

export default incidentService;
