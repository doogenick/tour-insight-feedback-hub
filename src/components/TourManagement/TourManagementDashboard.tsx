
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Users, AlertTriangle, MapPin, Plus, ArrowLeft, FileText } from 'lucide-react';
import { Tour, Client } from '../../services/api/types';
import { useSupabaseTours } from '../../hooks/useSupabaseTours';
import { useSupabaseFeedback } from '../../hooks/useSupabaseFeedback';
import TourCreationForm from './TourCreationForm';
import CrewManagement from './CrewManagement';
import ClientImport from './ClientImport';
import IncidentReporting from './IncidentReporting';
import MobileTourCard from './MobileTourCard';

const TourManagementDashboard: React.FC = () => {
  const { tours, isLoading, fetchTours, createTour } = useSupabaseTours();
  const { fetchFeedbackByTour } = useSupabaseFeedback();
  const [showTourForm, setShowTourForm] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [tourClients, setTourClients] = useState<{ [tourId: string]: Client[] }>({});
  const [viewMode, setViewMode] = useState<'tour-list' | 'feedback-viewer'>('tour-list');
  const [tourFeedback, setTourFeedback] = useState<any[]>([]);

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

  const handleViewFeedback = async (tour: Tour) => {
    setSelectedTour(tour);
    const feedback = await fetchFeedbackByTour(tour.tour_id);
    setTourFeedback(feedback || []);
    setViewMode('feedback-viewer');
  };

  const handleBackToTourList = () => {
    setSelectedTour(null);
    setTourFeedback([]);
    setViewMode('tour-list');
  };

  if (viewMode === 'feedback-viewer' && selectedTour) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleBackToTourList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tours
          </Button>
          <h2 className="text-xl font-bold">Feedback for {selectedTour.tour_name}</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tour Details - Verify Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Tour Code:</span>
                <p className="text-muted-foreground">{selectedTour.tour_code}</p>
              </div>
              <div>
                <span className="font-medium">Guide:</span>
                <p className="text-muted-foreground">{selectedTour.guide_name}</p>
              </div>
              <div>
                <span className="font-medium">Driver:</span>
                <p className="text-muted-foreground">{selectedTour.driver_name}</p>
              </div>
              <div>
                <span className="font-medium">Passengers:</span>
                <p className="text-muted-foreground">{selectedTour.passenger_count}</p>
              </div>
              <div>
                <span className="font-medium">Truck Name:</span>
                <p className="text-muted-foreground">{selectedTour.truck_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {tourFeedback.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Client Feedback ({tourFeedback.length})</h3>
            <div className="grid gap-4">
              {tourFeedback.map((fb, index) => (
                <Card key={fb.id || index}>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{fb.client_name || `Client ${index + 1}`}</p>
                          <p className="text-sm text-muted-foreground">
                            {fb.client_nationality && `Nationality: ${fb.client_nationality}`}
                          </p>
                        </div>
                        <Badge variant="default">★ {fb.overall_rating}/5</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div>Accommodation: {fb.accommodation_rating}/5</div>
                        <div>Activities: {fb.activities_rating}/5</div>
                        <div>Food: {fb.food_rating}/5</div>
                        <div>Vehicle: {fb.vehicle_rating}/5</div>
                      </div>
                      
                      {(fb.highlights || fb.improvements || fb.additional_comments) && (
                        <div className="mt-2 space-y-1">
                          {fb.highlights && (
                            <p className="text-sm">
                              <span className="font-medium">Enjoyed most:</span> {fb.highlights}
                            </p>
                          )}
                          {fb.improvements && (
                            <p className="text-sm">
                              <span className="font-medium">Improvements:</span> {fb.improvements}
                            </p>
                          )}
                          {fb.additional_comments && (
                            <p className="text-sm">
                              <span className="font-medium">Additional comments:</span> {fb.additional_comments}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {fb.submitted_at && `Submitted: ${new Date(fb.submitted_at).toLocaleDateString()}`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No feedback available for this tour.</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

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
                  onViewFeedback={handleViewFeedback}
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
