
import React from 'react';
import { Client, Tour } from '../services/api';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Users } from 'lucide-react';

interface ClientsListProps {
  selectedTour: Tour;
  clients: Client[];
}

const ClientsList: React.FC<ClientsListProps> = ({ selectedTour, clients }) => {
  const { setSelectedClient } = useAppContext();
  
  return (
    <Card className="w-full mb-8 animate-fade-in">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Select Client
        </CardTitle>
        <CardDescription>
          Select a client to provide feedback for tour {selectedTour.tour_id}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Tour Guide</p>
              <p className="font-medium">{selectedTour.guide_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Driver</p>
              <p className="font-medium">{selectedTour.driver_name}</p>
            </div>
          </div>
          
          <div className="divide-y">
            {clients.map((client) => (
              <div 
                key={client.client_id} 
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{client.full_name}</p>
                  <p className="text-sm text-muted-foreground">{client.email || 'No email provided'}</p>
                </div>
                <Button
                  onClick={() => setSelectedClient(client)}
                  variant="outline"
                  size="sm"
                >
                  Select
                </Button>
              </div>
            ))}
            
            {clients.length === 0 && (
              <div className="py-8 text-center">
                <p>No clients found for this tour.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please select a different tour or add clients.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsList;
