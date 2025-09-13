import { useState, useCallback } from 'react';
import { tourSupabaseService } from '@/services/supabaseServices';
import { useToast } from '@/components/ui/use-toast';

export function useSupabaseTours() {
  const [tours, setTours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchTours = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await tourSupabaseService.getAllTours();
      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tours from database.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchActiveTours = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await tourSupabaseService.getToursByFeedbackStatus('active');
      setTours(data || []);
    } catch (error) {
      console.error('Error fetching active tours:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load active tours from database.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createTour = useCallback(async (tourData: any) => {
    try {
      const newTour = await tourSupabaseService.createTour(tourData);
      setTours(prev => [newTour, ...prev]);
      toast({
        title: "Success",
        description: "Tour created successfully.",
      });
      return newTour;
    } catch (error) {
      console.error('Error creating tour:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create tour.",
      });
      throw error;
    }
  }, [toast]);

  const deleteTour = useCallback(async (tourId: string) => {
    try {
      await tourSupabaseService.deleteTour(tourId);
      setTours(prev => prev.filter(tour => tour.id !== tourId));
      toast({
        title: "Success",
        description: "Tour deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete tour.",
      });
      throw error;
    }
  }, [toast]);

  const updateTour = useCallback(async (id: string, updates: any) => {
    try {
      const updatedTour = await tourSupabaseService.updateTour(id, updates);
      setTours(prev => prev.map(tour => tour.id === id ? updatedTour : tour));
      toast({
        title: "Success",
        description: "Tour updated successfully.",
      });
      return updatedTour;
    } catch (error) {
      console.error('Error updating tour:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tour.",
      });
      throw error;
    }
  }, [toast]);


  return {
    tours,
    isLoading,
    fetchTours,
    fetchActiveTours,
    createTour,
    updateTour,
    deleteTour
  };
}