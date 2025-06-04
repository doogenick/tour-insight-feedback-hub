
import React, { useEffect, useState } from 'react';
import FeedbackForm from '../components/FeedbackForm';
import ComprehensiveFeedbackForm from '../components/ComprehensiveFeedbackForm';
import TourSelectionPanel from '../components/TourSelectionPanel';
import ClientsList from '../components/ClientsList';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Info, FileText, ClipboardList } from 'lucide-react';

const FeedbackPage: React.FC = () => {
  const { 
    selectedTour, 
    selectedClient, 
    clients = [], 
    fetchClients 
  } = useAppContext();
  
  const [formType, setFormType] = useState<'simple' | 'comprehensive'>('comprehensive');
  
  // Ensure clients are fetched when a tour is selected
  useEffect(() => {
    if (selectedTour && clients.length === 0) {
      fetchClients(selectedTour.tour_id);
    }
  }, [selectedTour, clients.length, fetchClients]);
  
  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Tour Feedback</h1>
      
      <TourSelectionPanel />
      
      {selectedTour && (
        <div className="space-y-8">
          {clients.length > 0 && !selectedClient && (
            <ClientsList selectedTour={selectedTour} clients={clients} />
          )}
          
          {!selectedClient ? (
            <Card className="mb-8 animate-fade-in">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Client Selection Required
                </CardTitle>
                <CardDescription>
                  Please select a client to proceed with feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p>
                  You've selected the {selectedTour.tour_name} tour (ID: {selectedTour.tour_id}) 
                  {selectedTour.guide_name && ` with ${selectedTour.guide_name} as guide`}
                  {selectedTour.driver_name && ` and ${selectedTour.driver_name} as driver`}.
                </p>
                <p className="mt-2">
                  Now please select a client from the list to complete their feedback form.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Choose Feedback Form Type
                  </CardTitle>
                  <CardDescription>
                    Select which feedback form to use for this client
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <Button
                    variant={formType === 'comprehensive' ? 'default' : 'outline'}
                    onClick={() => setFormType('comprehensive')}
                    className="flex items-center gap-2"
                  >
                    <ClipboardList className="h-4 w-4" />
                    Comprehensive Form (Recommended)
                  </Button>
                  <Button
                    variant={formType === 'simple' ? 'default' : 'outline'}
                    onClick={() => setFormType('simple')}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Simple Form
                  </Button>
                </CardContent>
              </Card>
              
              {formType === 'comprehensive' ? (
                <ComprehensiveFeedbackForm />
              ) : (
                <FeedbackForm />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
