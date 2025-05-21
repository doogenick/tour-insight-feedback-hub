
import React from 'react';
import FeedbackForm from '../components/FeedbackForm';
import TourSelectionPanel from '../components/TourSelectionPanel';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Info } from 'lucide-react';

const FeedbackPage: React.FC = () => {
  const { selectedTour, selectedClient } = useAppContext();
  
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Tour Feedback</h1>
      
      <TourSelectionPanel />
      
      {selectedTour && (
        <div>
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
                  with {selectedTour.guide_name} as guide and {selectedTour.driver_name} as driver.
                </p>
                <p className="mt-2">
                  Now please select a client from the list to complete their feedback form.
                </p>
              </CardContent>
            </Card>
          ) : (
            <FeedbackForm />
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
