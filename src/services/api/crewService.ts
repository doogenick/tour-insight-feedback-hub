import { v4 as uuidv4 } from 'uuid';
import { api, localforage } from './config';
import { CrewMember, TourCrewAssignment } from './types';

const crewService = {
  // Get all crew members
  getAllCrew: async (): Promise<CrewMember[]> => {
    try {
      const response = await api.get('/crew/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching crew:', error);
      // Fallback to local data
      const keys = await localforage.keys();
      const crewKeys = keys.filter(key => key.startsWith('crew_'));
      const crew: CrewMember[] = [];
      
      for (const key of crewKeys) {
        const crewMember = await localforage.getItem<CrewMember>(key);
        if (crewMember) {
          crew.push(crewMember);
        }
      }
      
      return crew;
    }
  },

  // Add new crew member
  addCrewMember: async (crewData: Omit<CrewMember, 'crew_id' | 'created_at'>): Promise<CrewMember> => {
    const newCrew: CrewMember = {
      ...crewData,
      crew_id: uuidv4(),
      created_at: new Date().toISOString()
    };

    try {
      const response = await api.post('/crew/create', newCrew);
      return response.data;
    } catch (error) {
      console.error('Error creating crew member:', error);
      // Store locally if API fails
      await localforage.setItem(`crew_${newCrew.crew_id}`, newCrew);
      return newCrew;
    }
  },

  // Assign crew to tour
  assignCrewToTour: async (tourId: string, crewId: string, role: 'guide' | 'driver' | 'assistant'): Promise<TourCrewAssignment> => {
    const assignment: TourCrewAssignment = {
      assignment_id: uuidv4(),
      tour_id: tourId,
      crew_id: crewId,
      role,
      assigned_at: new Date().toISOString()
    };

    try {
      const response = await api.post('/crew/assign', assignment);
      return response.data;
    } catch (error) {
      console.error('Error assigning crew to tour:', error);
      // Store locally if API fails
      await localforage.setItem(`assignment_${assignment.assignment_id}`, assignment);
      return assignment;
    }
  },

  // Get crew assignments for a tour
  getTourCrewAssignments: async (tourId: string): Promise<TourCrewAssignment[]> => {
    try {
      const response = await api.get(`/crew/tour/${tourId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching crew assignments for tour ${tourId}:`, error);
      return [];
    }
  }
};

export default crewService;
