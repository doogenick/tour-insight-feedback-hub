
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Tour, Client, Feedback } from '../services/api';
import { useFeedback } from '../hooks/useFeedback';
import { useTours } from '../hooks/useTours';
import { useAuth, User } from '../hooks/useAuth';

interface AppContextType {
  // Tour and Client Selection
  selectedTour: Tour | null;
  selectedClient: Client | null;
  clients: Client[];
  tours: Tour[];
  
  // Feedback Management
  feedback: Feedback[];
  isSubmitting: boolean;
  isLoading: boolean;
  syncStatus: { synced: number; failed: number } | null;
  
  // Demo Data Management
  demoDataGenerated: boolean;
  
  // Authentication
  currentUser: User | null;
  
  // Methods
  setSelectedTour: (tour: Tour | null) => void;
  setSelectedClient: (client: Client | null) => void;
  fetchClients: (tourId: string) => Promise<void>;
  submitFeedback: (feedbackData: Omit<Feedback, 'id' | 'status' | 'submitted_at'>) => Promise<{ success: boolean; data?: Feedback; message: string }>;
  
  // Feedback Methods
  fetchFeedback: (tourId?: string) => Promise<void>;
  syncPendingFeedback: () => Promise<void>;
  exportFeedback: () => Promise<Blob>;
  
  // Tour Methods
  fetchTours: () => Promise<void>;
  
  // Demo Data Methods
  generateDemoData: () => Promise<void>;
  resetDemoData: () => Promise<void>;
  
  // Auth Methods
  loginUser: (name: string, role: string, email?: string) => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [demoDataGenerated, setDemoDataGenerated] = useState<boolean>(false);
  
  const { 
    feedback, 
    submitFeedback, 
    fetchFeedback, 
    syncPendingFeedback, 
    exportFeedback, 
    isSubmitting, 
    syncStatus, 
    isLoading: feedbackLoading 
  } = useFeedback();
  
  const { tours, fetchTours, isLoading: toursLoading } = useTours();
  const { currentUser, loginUser, logoutUser } = useAuth();

  const fetchClients = useCallback(async (tourId: string) => {
    try {
      // Mock implementation - replace with actual API call
      const mockClients: Client[] = [
        {
          client_id: '1',
          full_name: 'John Doe',
          email: 'john@example.com',
          tour_id: tourId
        },
        {
          client_id: '2',
          full_name: 'Jane Smith',
          email: 'jane@example.com',
          tour_id: tourId
        }
      ];
      setClients(mockClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    }
  }, []);

  const generateDemoData = useCallback(async () => {
    try {
      // Mock demo data generation
      console.log('Generating demo data...');
      setDemoDataGenerated(true);
      await fetchTours();
    } catch (error) {
      console.error('Error generating demo data:', error);
    }
  }, [fetchTours]);

  const resetDemoData = useCallback(async () => {
    try {
      console.log('Resetting demo data...');
      setDemoDataGenerated(false);
      setSelectedTour(null);
      setSelectedClient(null);
      setClients([]);
    } catch (error) {
      console.error('Error resetting demo data:', error);
    }
  }, []);

  const value: AppContextType = {
    // Tour and Client Selection
    selectedTour,
    selectedClient,
    clients: clients || [],
    tours: tours || [],
    
    // Feedback Management
    feedback: feedback || [],
    isSubmitting: isSubmitting || false,
    isLoading: feedbackLoading || toursLoading || false,
    syncStatus,
    
    // Demo Data Management
    demoDataGenerated,
    
    // Authentication
    currentUser,
    
    // Methods
    setSelectedTour,
    setSelectedClient,
    fetchClients,
    submitFeedback,
    
    // Feedback Methods
    fetchFeedback,
    syncPendingFeedback,
    exportFeedback,
    
    // Tour Methods
    fetchTours,
    
    // Demo Data Methods
    generateDemoData,
    resetDemoData,
    
    // Auth Methods
    loginUser,
    logoutUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
