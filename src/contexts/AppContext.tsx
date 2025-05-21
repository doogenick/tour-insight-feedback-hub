
import React, { createContext, useContext, useState, useEffect } from 'react';
import { tourService, feedbackService, Tour, Client, Feedback } from '../services/api';
import { toast } from '../components/ui/use-toast';

interface AppContextProps {
  tours: Tour[];
  clients: Client[];
  feedback: Feedback[];
  selectedTour: Tour | null;
  selectedClient: Client | null;
  isLoading: boolean;
  isSubmitting: boolean;
  syncStatus: { synced: number; failed: number } | null;
  demoDataGenerated: boolean;
  currentUser: { name: string; role: 'admin' | 'guide' | 'driver' | 'client' } | null;
  fetchTours: () => Promise<void>;
  fetchClients: (tourId: string) => Promise<void>;
  fetchFeedback: (tourId?: string) => Promise<void>;
  setSelectedTour: (tour: Tour | null) => void;
  setSelectedClient: (client: Client | null) => void;
  submitFeedback: (feedbackData: Omit<Feedback, 'id' | 'status' | 'submitted_at'>) => Promise<{ success: boolean; message: string; data?: Feedback }>;
  exportFeedback: () => Promise<Blob>;
  syncPendingFeedback: () => Promise<void>;
  generateDemoData: () => Promise<void>;
  resetDemoData: () => Promise<void>;
  loginUser: (name: string, role: 'admin' | 'guide' | 'driver' | 'client') => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{ synced: number; failed: number } | null>(null);
  const [demoDataGenerated, setDemoDataGenerated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'admin' | 'guide' | 'driver' | 'client' } | null>(null);

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
  
  const fetchFeedback = async (tourId?: string): Promise<void> => {
    setIsLoading(true);
    try {
      let feedbackData: Feedback[];
      
      if (tourId) {
        feedbackData = await feedbackService.getFeedbackByTour(tourId);
      } else {
        feedbackData = await feedbackService.getAllFeedback();
      }
      
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load feedback. Please try again.",
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
  
  const generateDemoData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { tours: generatedTours, clients: generatedClients, feedback: generatedFeedback } = 
        await tourService.generateDemoData();
      
      setTours(generatedTours);
      setClients(generatedClients);
      setFeedback(generatedFeedback);
      setDemoDataGenerated(true);
      
      toast({
        title: "Demo Data Generated",
        description: `Created ${generatedTours.length} tours, ${generatedClients.length} clients, and ${generatedFeedback.length} feedback entries.`,
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
  };
  
  const resetDemoData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await tourService.resetDemoData();
      
      setTours([]);
      setClients([]);
      setFeedback([]);
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
  };
  
  const loginUser = (name: string, role: 'admin' | 'guide' | 'driver' | 'client'): void => {
    setCurrentUser({ name, role });
    toast({
      title: "Logged In",
      description: `Welcome, ${name}!`,
      duration: 3000,
    });
  };
  
  const logoutUser = (): void => {
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out.",
      duration: 3000,
    });
  };

  return (
    <AppContext.Provider
      value={{
        tours,
        clients,
        feedback,
        selectedTour,
        selectedClient,
        isLoading,
        isSubmitting,
        syncStatus,
        demoDataGenerated,
        currentUser,
        fetchTours,
        fetchClients,
        fetchFeedback,
        setSelectedTour,
        setSelectedClient,
        submitFeedback,
        exportFeedback,
        syncPendingFeedback,
        generateDemoData,
        resetDemoData,
        loginUser,
        logoutUser
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
