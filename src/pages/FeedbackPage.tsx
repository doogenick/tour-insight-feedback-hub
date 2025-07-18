
import React, { useEffect } from 'react';
import ComprehensiveFeedbackForm from '../components/ComprehensiveFeedbackForm';
import TourSelectionPanel from '../components/TourSelectionPanel';
import ClientsList from '../components/ClientsList';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Info, ClipboardList } from 'lucide-react';
import { useIsMobile, useIsTablet, useIsDesktop } from '../hooks/use-mobile';

const FeedbackPage: React.FC = () => {
  const { 
    selectedTour, 
    selectedClient, 
    clients = [], 
    fetchClients 
  } = useAppContext();
  
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  
  // Ensure clients are fetched when a tour is selected
  useEffect(() => {
    if (selectedTour && clients.length === 0) {
      fetchClients(selectedTour.tour_id);
    }
  }, [selectedTour, clients.length, fetchClients]);
  
  return (
    <div className={`
      py-8
      ${isMobile ? 'container max-w-sm' : ''}
      ${isTablet ? 'container max-w-4xl' : ''}
      ${isDesktop ? 'container max-w-6xl' : ''}
    `}>
      <h1 className={`
        font-bold text-center mb-8
        ${isMobile ? 'text-2xl' : ''}
        ${isTablet ? 'text-3xl' : ''}
        ${isDesktop ? 'text-3xl' : ''}
      `}>
        Tour Feedback
      </h1>
      
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
              <CardContent className={`
                ${isMobile ? 'p-4' : ''}
                ${isTablet ? 'p-6' : ''}
                ${isDesktop ? 'p-6' : ''}
              `}>
                <p className={`
                  ${isMobile ? 'text-sm' : ''}
                  ${isTablet ? 'text-base' : ''}
                  ${isDesktop ? 'text-base' : ''}
                `}>
                  You've selected the {selectedTour.tour_name} tour (ID: {selectedTour.tour_id}) 
                  {selectedTour.guide_name && ` with ${selectedTour.guide_name} as guide`}
                  {selectedTour.driver_name && ` and ${selectedTour.driver_name} as driver`}.
                </p>
                <p className={`
                  mt-2
                  ${isMobile ? 'text-sm' : ''}
                  ${isTablet ? 'text-base' : ''}
                  ${isDesktop ? 'text-base' : ''}
                `}>
                  Now please select a client from the list to complete their feedback form.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Comprehensive Feedback Form
                  </CardTitle>
                  <CardDescription>
                    Complete detailed feedback for {selectedClient.full_name}
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <ComprehensiveFeedbackForm />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
