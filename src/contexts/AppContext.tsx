
import React, { createContext, useContext, useState, useEffect } from 'react';
import { tourService, feedbackService, Tour, Client, Feedback } from '../services/api';
import { toast } from '../components/ui/use-toast';

interface AppContextProps {
  tours: Tour[];
  clients: Client[];
  selectedTour: Tour | null;
  selectedClient: Client | null;
  isLoading: boolean;
  isSubmitting: boolean;
  syncStatus: { synced: number; failed: number } | null;
  fetchTours: () => Promise<void>;
  fetchClients: (tourId: string) => Promise<void>;
  setSelectedTour: (tour: Tour | null) => void;
  setSelectedClient: (client: Client | null) => void;
  submitFeedback: (feedbackData: Omit<Feedback, 'id' | 'status' | 'submitted_at'>) => Promise<{ success: boolean; message: string; data?: Feedback }>;
  exportFeedback: () => Promise<Blob>;
  syncPendingFeedback: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{ synced: number; failed: number } | null>(null);

  // Fetch tours on component mount
  useEffect(() => {
    fetchTours();
  }, []);

  // Listen for online status changes and sync pending feedback
  useEffect(() => {
    const handleOnline = () => {
      toast({
        title: "You're back online!",
        description: "Syncing your feedback data...",
        duration: 3000,
      });
      syncPendingFeedback();
    };

    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const fetchTours = async (): Promise<void> => {
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
  };

  const fetchClients = async (tourId: string): Promise<void> => {
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
  };

  const submitFeedback = async (feedbackData: Omit<Feedback, 'id' | 'status' | 'submitted_at'>) => {
    setIsSubmitting(true);
    try {
      const result = await feedbackService.submitFeedback(feedbackData);
      
      toast({
        title: "Success!",
        description: result.message,
        duration: 5000,
      });
      
      return result;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Your feedback has been saved locally.",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const syncPendingFeedback = async (): Promise<void> => {
    try {
      const status = await feedbackService.syncPendingFeedback();
      setSyncStatus(status);
      
      if (status.synced > 0) {
        toast({
          title: "Sync Complete",
          description: `${status.synced} feedback submissions synchronized successfully.`,
          duration: 5000,
        });
      }
      
      if (status.failed > 0) {
        toast({
          variant: "destructive",
          title: "Sync Issues",
          description: `${status.failed} feedback submissions failed to sync.`,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error syncing feedback:', error);
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "Failed to synchronize feedback data.",
      });
    }
  };

  const exportFeedback = async (): Promise<Blob> => {
    setIsLoading(true);
    try {
      return await feedbackService.exportFeedbackToCsv();
    } catch (error) {
      console.error('Error exporting feedback:', error);
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "Failed to export feedback data.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        tours,
        clients,
        selectedTour,
        selectedClient,
        isLoading,
        isSubmitting,
        syncStatus,
        fetchTours,
        fetchClients,
        setSelectedTour,
        setSelectedClient,
        submitFeedback,
        exportFeedback,
        syncPendingFeedback
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
