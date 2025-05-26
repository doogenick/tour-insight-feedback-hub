
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Users, AlertTriangle, MapPin, Plus } from 'lucide-react';
import { Tour, Client } from '../../services/api/types';
import { useAppContext } from '../../contexts/AppContext';
import TourCreationForm from './TourCreationForm';
import CrewManagement from './CrewManagement';
import ClientImport from './ClientImport';
import IncidentReporting from './IncidentReporting';

const TourManagementDashboard: React.FC = () => {
  const { tours, clients, fetchTours, fetchClients } = useAppContext();
  const [showTourForm, setShowTourForm] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [tourClients, setTourClients] = useState<{ [tourId: string]: Client[] }>({});

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handleTourCreated = (newTour: Tour) => {
    setShowTourForm(false);
    fetchTours();
  };

  const handleTourSelect = async (tour: Tour) => {
    setSelectedTour(tour);
    if (!tourClients[tour.tour_id]) {
      await fetchClients(tour.tour_id);
    }
  };

  const handleClientsImported = (importedClients: Client[]) => {
    if (selectedTour) {
      setTourClients({
        ...tourClients,
        [selectedTour.tour_id]: [...(tourClients[selectedTour.tour_id] || []), ...importedClients]
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tour Management</h2>
          <p className="text-muted-foreground">
            Manage tours, crew, clients, and incidents
          </p>
        </div>
      </div>

      <Tabs defaultValue="tours">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="tours">Tours</TabsTrigger>
          <TabsTrigger value="crew">Crew Management</TabsTrigger>
          <TabsTrigger value="clients">Client Import</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="tours" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Tour Overview</h3>
            <Button onClick={() => setShowTourForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Tour
            </Button>
          </div>

          {showTourForm && (
            <TourCreationForm
              onTourCreated={handleTourCreated}
              onCancel={() => setShowTourForm(false)}
            />
          )}

          <div className="grid gap-4">
            {tours.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No tours found. Create your first tour to get started.
                </CardContent>
              </Card>
            ) : (
              tours.map(tour => (
                <Card key={tour.tour_id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleTourSelect(tour)}>
                  <CardContent className="py-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{tour.tour_name}</h4>
                          <Badge variant="outline">{tour.tour_id}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(tour.date_start)} - {formatDate(tour.date_end)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {tour.passenger_count} passengers
                          </span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          Guide: {tour.guide_name} • Driver: {tour.driver_name}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="crew">
          <CrewManagement />
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          {!selectedTour ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Please select a tour from the Tours tab to import clients.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Import Clients for {selectedTour.tour_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Tour ID: {selectedTour.tour_id}
                </p>
              </div>
              
              <ClientImport
                tourId={selectedTour.tour_id}
                onClientsImported={handleClientsImported}
              />
              
              {tourClients[selectedTour.tour_id] && tourClients[selectedTour.tour_id].length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Current Clients ({tourClients[selectedTour.tour_id].length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {tourClients[selectedTour.tour_id].map(client => (
                        <div key={client.client_id} className="flex justify-between items-center p-2 border rounded">
                          <span>{client.full_name}</span>
                          {client.email && <span className="text-sm text-muted-foreground">{client.email}</span>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentReporting tours={tours} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TourManagementDashboard;
