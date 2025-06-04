
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Tour, Client, Feedback } from '../services/api';

export interface User {
  name: string;
  role: 'admin' | 'guide' | 'driver' | 'client';
  email?: string;
}

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
  const [tours, setTours] = useState<Tour[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{ synced: number; failed: number } | null>(null);
  const [demoDataGenerated, setDemoDataGenerated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchClients = useCallback(async (tourId: string) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTours = useCallback(async () => {
    try {
      setIsLoading(true);
      // Mock implementation
      const mockTours: Tour[] = [
        {
          tour_id: '1',
          tour_name: 'Cape Town Adventure',
          guide_name: 'Sarah Johnson',
          driver_name: 'Mike Wilson',
          tour_date: '2024-06-15',
          status: 'upcoming'
        },
        {
          tour_id: '2',
          tour_name: 'Safari Experience',
          guide_name: 'David Brown',
          driver_name: 'Tom Anderson',
          tour_date: '2024-06-20',
          status: 'upcoming'
        }
      ];
      setTours(mockTours);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFeedback = useCallback(async (tourId?: string) => {
    try {
      setIsLoading(true);
      // Mock implementation
      setFeedback([]);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitFeedback = useCallback(async (feedbackData: Omit<Feedback, 'id' | 'status' | 'submitted_at'>) => {
    try {
      setIsSubmitting(true);
      // Mock implementation
      const newFeedback: Feedback = {
        ...feedbackData,
        id: `fb_${Date.now()}`,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      };
      
      setFeedback(prev => [...prev, newFeedback]);
      
      return {
        success: true,
        data: newFeedback,
        message: 'Feedback submitted successfully!'
      };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return {
        success: false,
        message: 'Failed to submit feedback'
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const syncPendingFeedback = useCallback(async () => {
    // Mock implementation
    setSyncStatus({ synced: 0, failed: 0 });
  }, []);

  const exportFeedback = useCallback(async (): Promise<Blob> => {
    // Mock implementation
    return new Blob(['mock csv data'], { type: 'text/csv' });
  }, []);

  const generateDemoData = useCallback(async () => {
    try {
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
      setTours([]);
      setFeedback([]);
    } catch (error) {
      console.error('Error resetting demo data:', error);
    }
  }, []);

  const loginUser = useCallback((name: string, role: string, email?: string) => {
    const user: User = {
      name,
      role: role as User['role'],
      email
    };
    setCurrentUser(user);
  }, []);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // Auto-login demo user if in demo mode
  React.useEffect(() => {
    if (import.meta.env.VITE_DEMO_MODE === 'true' && !currentUser) {
      loginUser('Demo Admin', 'admin', 'demo@example.com');
    }
  }, [currentUser, loginUser]);

  const value: AppContextType = {
    // Tour and Client Selection
    selectedTour,
    selectedClient,
    clients,
    tours,
    
    // Feedback Management
    feedback,
    isSubmitting,
    isLoading,
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
