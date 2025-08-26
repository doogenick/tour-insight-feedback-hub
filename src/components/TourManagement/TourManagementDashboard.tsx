
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Users, AlertTriangle, MapPin, Plus } from 'lucide-react';
import { Tour, Client } from '../../services/api/types';
import { useSupabaseTours } from '../../hooks/useSupabaseTours';
import TourCreationForm from './TourCreationForm';
import CrewManagement from './CrewManagement';
import ClientImport from './ClientImport';
import IncidentReporting from './IncidentReporting';
import MobileTourCard from './MobileTourCard';

const TourManagementDashboard: React.FC = () => {
  const { tours, isLoading, fetchTours, createTour } = useSupabaseTours();
  const [showTourForm, setShowTourForm] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [tourClients, setTourClients] = useState<{ [tourId: string]: Client[] }>({});

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handleTourCreated = async (newTour: Tour) => {
    try {
      // Convert Tour type to match Supabase schema
      await createTour({
        tour_code: newTour.tour_code!,
        tour_name: newTour.tour_name,
        date_start: newTour.date_start,
        date_end: newTour.date_end,
        passenger_count: newTour.passenger_count,
        guide_id: null, // Will be set later when crew is assigned
        driver_id: null, // Will be set later when crew is assigned
        truck_name: newTour.truck_name,
        tour_leader: newTour.tour_leader,
        tour_type: newTour.tour_type,
        vehicle_name: newTour.vehicle_name,
        status: newTour.status
      });
      setShowTourForm(false);
    } catch (error) {
      console.error('Error creating tour:', error);
    }
  };

  const handleTourSelect = async (tour: Tour) => {
    setSelectedTour(tour);
    // TODO: Implement client fetching from Supabase when needed
  };

  const handleClientsImported = (importedClients: Client[]) => {
    if (selectedTour) {
      setTourClients({
        ...tourClients,
        [selectedTour.tour_id]: [...(tourClients[selectedTour.tour_id] || []), ...importedClients]
      });
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Tour Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage tours, crew, clients, and incidents
          </p>
        </div>
      </div>

      <Tabs defaultValue="tours">
        <TabsList className="grid grid-cols-4 mb-6 h-12">
          <TabsTrigger value="tours" className="text-xs md:text-sm">Tours</TabsTrigger>
          <TabsTrigger value="crew" className="text-xs md:text-sm">Crew</TabsTrigger>
          <TabsTrigger value="clients" className="text-xs md:text-sm">Clients</TabsTrigger>
          <TabsTrigger value="incidents" className="text-xs md:text-sm">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="tours" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Tour Overview</h3>
            <Button onClick={() => setShowTourForm(true)} className="flex items-center gap-2" size="sm">
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Create New Tour</span>
              <span className="md:hidden">New</span>
            </Button>
          </div>

          {showTourForm && (
            <TourCreationForm
              onTourCreated={handleTourCreated}
              onCancel={() => setShowTourForm(false)}
            />
          )}

          <div className="grid gap-4">
            {isLoading ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Loading tours...
                </CardContent>
              </Card>
            ) : tours.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No tours found. Create your first tour to get started.
                </CardContent>
              </Card>
            ) : (
              tours.map(tour => (
                <MobileTourCard 
                  key={tour.id} 
                  tour={{
                    ...tour,
                    tour_id: tour.id,
                    guide_name: tour.guide?.full_name || 'Not assigned',
                    driver_name: tour.driver?.full_name || 'Not assigned'
                  } as Tour} 
                  onSelect={handleTourSelect} 
                />
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
                          <span className="text-sm">{client.full_name}</span>
                          {client.email && <span className="text-xs text-muted-foreground">{client.email}</span>}
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
