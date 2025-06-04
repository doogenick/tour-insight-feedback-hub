
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Tour, Client, Feedback } from '../services/api';
import { useFeedback } from '../hooks/useFeedback';
import { useTours } from '../hooks/useTours';

interface AppContextType {
  selectedTour: Tour | null;
  selectedClient: Client | null;
  clients: Client[];
  tours: Tour[];
  isSubmitting: boolean;
  setSelectedTour: (tour: Tour | null) => void;
  setSelectedClient: (client: Client | null) => void;
  fetchClients: (tourId: string) => Promise<void>;
  submitFeedback: (feedbackData: Omit<Feedback, 'id' | 'status' | 'submitted_at'>) => Promise<{ success: boolean; data?: Feedback; message: string }>;
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
  
  const { submitFeedback, isSubmitting } = useFeedback();
  const { tours } = useTours();

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

  const value: AppContextType = {
    selectedTour,
    selectedClient,
    clients: clients || [],
    tours: tours || [],
    isSubmitting: isSubmitting || false,
    setSelectedTour,
    setSelectedClient,
    fetchClients,
    submitFeedback
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
