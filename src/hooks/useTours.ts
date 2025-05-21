
import { useState, useCallback } from 'react';
import { tourService, Tour, Client } from '../services/api';
import { useToast } from '../components/ui/use-toast';

export function useTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [demoDataGenerated, setDemoDataGenerated] = useState<boolean>(false);
  
  const { toast } = useToast();

  const fetchTours = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const toursData = await tourService.getUpcomingTours();
      setTours(toursData);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tours. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchClients = useCallback(async (tourId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const clientsData = await tourService.getTourClients(tourId);
      setClients(clientsData);
    } catch (error) {
      console.error(`Error fetching clients for tour ${tourId}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load clients. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const generateDemoData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { tours: generatedTours, clients: generatedClients } = 
        await tourService.generateDemoData();
      
      setTours(generatedTours);
      setClients(generatedClients);
      setDemoDataGenerated(true);
      
      toast({
        title: "Demo Data Generated",
        description: `Created ${generatedTours.length} tours with clients`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error generating demo data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate demo data.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const resetDemoData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await tourService.resetDemoData();
      
      setTours([]);
      setClients([]);
      setDemoDataGenerated(false);
      
      toast({
        title: "Demo Data Reset",
        description: "All demo data has been cleared.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error resetting demo data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset demo data.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    tours,
    clients,
    selectedTour,
    selectedClient,
    isLoading,
    demoDataGenerated,
    fetchTours,
    fetchClients,
    setSelectedTour,
    setSelectedClient,
    generateDemoData,
    resetDemoData
  };
}
