
import { useState, useCallback } from 'react';
import { tourService, Tour, Client } from '../services/api';
import { useToast } from '../components/ui/use-toast';

export function useTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  
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

  return {
    tours,
    clients,
    selectedTour,
    selectedClient,
    isLoading,
    fetchTours,
    fetchClients,
    setSelectedTour,
    setSelectedClient
  };
}
