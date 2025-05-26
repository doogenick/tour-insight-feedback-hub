
import { useState, useCallback } from 'react';
import { CrewMember, TourCrewAssignment } from '../services/api/types';
import crewService from '../services/api/crewService';
import { useToast } from '../components/ui/use-toast';

export function useCrew() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [assignments, setAssignments] = useState<TourCrewAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { toast } = useToast();

  const fetchCrew = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const crewData = await crewService.getAllCrew();
      setCrew(crewData);
    } catch (error) {
      console.error('Error fetching crew:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load crew members. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addCrewMember = useCallback(async (crewData: Omit<CrewMember, 'crew_id' | 'created_at'>): Promise<CrewMember | null> => {
    setIsLoading(true);
    try {
      const newCrew = await crewService.addCrewMember(crewData);
      setCrew(prev => [...prev, newCrew]);
      
      toast({
        title: "Crew Member Added",
        description: `${newCrew.full_name} has been added to the crew.`,
      });
      
      return newCrew;
    } catch (error) {
      console.error('Error adding crew member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add crew member.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const assignCrewToTour = useCallback(async (tourId: string, crewId: string, role: 'guide' | 'driver' | 'assistant'): Promise<TourCrewAssignment | null> => {
    setIsLoading(true);
    try {
      const assignment = await crewService.assignCrewToTour(tourId, crewId, role);
      setAssignments(prev => [...prev, assignment]);
      
      toast({
        title: "Crew Assigned",
        description: "Crew member has been assigned to the tour.",
      });
      
      return assignment;
    } catch (error) {
      console.error('Error assigning crew:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign crew member.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    crew,
    assignments,
    isLoading,
    fetchCrew,
    addCrewMember,
    assignCrewToTour
  };
}
