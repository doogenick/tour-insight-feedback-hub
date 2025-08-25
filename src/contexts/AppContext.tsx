
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
  
  
  // Authentication - Always demo admin for mobile
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
  
  
  // Auth Methods (simplified for mobile demo)
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
  
  
  // Always set admin user for mobile demo
  const [currentUser] = useState<User>({
    name: 'Mobile Admin',
    role: 'admin',
    email: 'admin@mobile.demo'
  });

  const fetchClients = useCallback(async (tourId: string) => {
    try {
      setIsLoading(true);
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
        },
        {
          client_id: '3',
          full_name: 'Mike Wilson',
          email: 'mike@example.com',
          tour_id: tourId
        },
        {
          client_id: '4',
          full_name: 'Sarah Brown',
          email: 'sarah@example.com',
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
      const mockTours: Tour[] = [
        {
          tour_id: 'TAD140525',
          tour_name: 'Cape Town Adventure',
          date_start: '2025-05-14',
          date_end: '2025-05-20',
          passenger_count: 12,
          guide_name: 'Sarah Johnson',
          driver_name: 'Mike Wilson'
        },
        {
          tour_id: 'ZZK250116R',
          tour_name: 'Safari Experience',
          date_start: '2026-01-25',
          date_end: '2026-02-05',
          passenger_count: 8,
          guide_name: 'David Brown',
          driver_name: 'Tom Anderson'
        },
        {
          tour_id: 'GDN030312',
          tour_name: 'Garden Route Explorer',
          date_start: '2025-03-03',
          date_end: '2025-03-12',
          passenger_count: 15,
          guide_name: 'Emma Davis',
          driver_name: 'Chris Miller'
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
      const newFeedback: Feedback = {
        ...feedbackData,
        id: `fb_${Date.now()}`,
        status: 'Pending',
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
    setSyncStatus({ synced: 0, failed: 0 });
  }, []);

  const exportFeedback = useCallback(async (): Promise<Blob> => {
    return new Blob(['mock csv data'], { type: 'text/csv' });
  }, []);


  // Simplified auth methods for mobile demo
  const loginUser = useCallback((name: string, role: string, email?: string) => {
    console.log('Auth disabled for mobile demo - always admin access');
  }, []);

  const logoutUser = useCallback(() => {
    console.log('Auth disabled for mobile demo - always admin access');
  }, []);

  const value: AppContextType = {
    selectedTour,
    selectedClient,
    clients,
    tours,
    feedback,
    isSubmitting,
    isLoading,
    syncStatus,
    
    currentUser,
    setSelectedTour,
    setSelectedClient,
    fetchClients,
    submitFeedback,
    fetchFeedback,
    syncPendingFeedback,
    exportFeedback,
    fetchTours,
    loginUser,
    logoutUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
