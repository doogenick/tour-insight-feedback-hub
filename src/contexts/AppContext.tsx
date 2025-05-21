
import React, { createContext, useContext, useEffect } from 'react';
import { Tour, Client, Feedback } from '../services/api';
import { useTours } from '../hooks/useTours';
import { useFeedback } from '../hooks/useFeedback';
import { useAuth, User, UserRole } from '../hooks/useAuth';
import { useToast } from '../components/ui/use-toast';

interface AppContextProps {
  // Tour state
  tours: Tour[];
  clients: Client[];
  selectedTour: Tour | null;
  selectedClient: Client | null;
  
  // Feedback state
  feedback: Feedback[];
  isSubmitting: boolean;
  syncStatus: { synced: number; failed: number } | null;
  
  // Loading and demo state
  isLoading: boolean;
  demoDataGenerated: boolean;
  
  // User state
  currentUser: User | null;
  
  // Tour functions
  fetchTours: () => Promise<void>;
  fetchClients: (tourId: string) => Promise<void>;
  setSelectedTour: (tour: Tour | null) => void;
  setSelectedClient: (client: Client | null) => void;
  generateDemoData: () => Promise<void>;
  resetDemoData: () => Promise<void>;
  
  // Feedback functions
  fetchFeedback: (tourId?: string) => Promise<void>;
  submitFeedback: (feedbackData: Omit<Feedback, 'id' | 'status' | 'submitted_at'>) => Promise<{ success: boolean; message: string; data?: Feedback }>;
  exportFeedback: () => Promise<Blob>;
  syncPendingFeedback: () => Promise<void>;
  
  // Auth functions
  loginUser: (name: string, role: UserRole) => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tourState = useTours();
  const feedbackState = useFeedback();
  const authState = useAuth();
  const { toast } = useToast();
  
  // Fetch tours on component mount
  useEffect(() => {
    tourState.fetchTours();
  }, [tourState.fetchTours]);

  // Listen for online status changes and sync pending feedback
  useEffect(() => {
    const handleOnline = () => {
      toast({
        title: "You're back online!",
        description: "Syncing your feedback data...",
        duration: 3000,
      });
      feedbackState.syncPendingFeedback();
    };

    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [feedbackState, toast]);

  const contextValue: AppContextProps = {
    // Tour state
    tours: tourState.tours,
    clients: tourState.clients,
    selectedTour: tourState.selectedTour,
    selectedClient: tourState.selectedClient,
    
    // Feedback state
    feedback: feedbackState.feedback,
    isSubmitting: feedbackState.isSubmitting,
    syncStatus: feedbackState.syncStatus,
    
    // Loading and demo state
    isLoading: tourState.isLoading || feedbackState.isLoading,
    demoDataGenerated: tourState.demoDataGenerated,
    
    // User state
    currentUser: authState.currentUser,
    
    // Tour functions
    fetchTours: tourState.fetchTours,
    fetchClients: tourState.fetchClients,
    setSelectedTour: tourState.setSelectedTour,
    setSelectedClient: tourState.setSelectedClient,
    generateDemoData: tourState.generateDemoData,
    resetDemoData: tourState.resetDemoData,
    
    // Feedback functions
    fetchFeedback: feedbackState.fetchFeedback,
    submitFeedback: feedbackState.submitFeedback,
    exportFeedback: feedbackState.exportFeedback,
    syncPendingFeedback: feedbackState.syncPendingFeedback,
    
    // Auth functions
    loginUser: authState.loginUser,
    logoutUser: authState.logoutUser
  };

  return (
    <AppContext.Provider value={contextValue}>
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
