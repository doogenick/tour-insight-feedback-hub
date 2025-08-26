import { useState, useCallback } from 'react';
import { crewSupabaseService } from '@/services/supabaseServices';
import { useToast } from '@/components/ui/use-toast';

export function useSupabaseCrew() {
  const [crew, setCrew] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCrew = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await crewSupabaseService.getAllCrew();
      setCrew(data || []);
    } catch (error) {
      console.error('Error fetching crew:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load crew from database.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addCrewMember = useCallback(async (crewData: any) => {
    try {
      const newMember = await crewSupabaseService.createCrewMember(crewData);
      setCrew(prev => [newMember, ...prev]);
      toast({
        title: "Success",
        description: "Crew member added successfully.",
      });
      return newMember;
    } catch (error) {
      console.error('Error adding crew member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add crew member.",
      });
      throw error;
    }
  }, [toast]);

  const updateCrewMember = useCallback(async (id: string, updates: any) => {
    try {
      const updatedMember = await crewSupabaseService.updateCrewMember(id, updates);
      setCrew(prev => prev.map(member => member.id === id ? updatedMember : member));
      toast({
        title: "Success",
        description: "Crew member updated successfully.",
      });
      return updatedMember;
    } catch (error) {
      console.error('Error updating crew member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update crew member.",
      });
      throw error;
    }
  }, [toast]);

  const deleteCrewMember = useCallback(async (id: string) => {
    try {
      await crewSupabaseService.deleteCrewMember(id);
      setCrew(prev => prev.filter(member => member.id !== id));
      toast({
        title: "Success",
        description: "Crew member removed successfully.",
      });
    } catch (error) {
      console.error('Error removing crew member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove crew member.",
      });
      throw error;
    }
  }, [toast]);

  return {
    crew,
    isLoading,
    fetchCrew,
    addCrewMember,
    updateCrewMember,
    deleteCrewMember
  };
}