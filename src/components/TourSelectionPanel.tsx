
import React, { useEffect } from 'react';
import { Tour } from '../services/api';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Check, Database, X } from 'lucide-react';
import ManualTourEntryDialog from './MobileFeedbackFlow/ManualTourEntryDialog';
import { useToast } from './ui/use-toast';

const TourSelectionPanel: React.FC = () => {
  const { 
    tours, 
    demoDataGenerated, 
    generateDemoData, 
    resetDemoData,
    isLoading,
    setSelectedTour,
    fetchClients,
    selectedTour
  } = useAppContext();
  const { toast } = useToast();

  // Generate demo data if none exists
  useEffect(() => {
    if (tours.length === 0 && !demoDataGenerated && !isLoading) {
      generateDemoData();
    }
  }, [tours.length, demoDataGenerated, generateDemoData, isLoading]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleTourSelect = (tour: Tour) => {
    setSelectedTour(tour);
    fetchClients(tour.tour_id);
  };

  return (
    <Card className="w-full mb-8 animate-fade-in">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Tour Selection
          </span>
          <ManualTourEntryDialog onCreate={(tour) => {
            setSelectedTour(tour);
            toast({ title: 'Manual tour created', description: `${tour.tour_name}` });
          }} />
        </CardTitle>
        <CardDescription>
          Select a tour to view clients and submit feedback, or create a manual entry
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Demo Data Management */}
          <div className="flex flex-wrap gap-2 justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetDemoData}
              disabled={isLoading || tours.length === 0}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Reset Demo Data
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateDemoData}
              disabled={isLoading}
              className="text-xs"
            >
              <Database className="h-3 w-3 mr-1" />
              Generate Demo Data
            </Button>
          </div>

          {/* Tour List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tours.map((tour) => (
              <Card 
                key={tour.tour_id}
                className={`cursor-pointer transition-colors border-2 hover:bg-muted/30 ${
                  selectedTour?.tour_id === tour.tour_id ? 'border-primary' : 'border-border'
                }`}
                onClick={() => handleTourSelect(tour)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{tour.tour_id}</h3>
                      <p className="text-muted-foreground text-sm">{tour.tour_name}</p>
                    </div>
                    
                    {selectedTour?.tour_id === tour.tour_id && (
                      <div className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">Dates:</span>{' '}
                      {formatDate(tour.date_start)} - {formatDate(tour.date_end)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Clients:</span>{' '}
                      {tour.passenger_count}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Guide:</span>{' '}
                      {tour.guide_name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Driver:</span>{' '}
                      {tour.driver_name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {tours.length === 0 && !isLoading && (
              <div className="col-span-2 text-center py-6 bg-muted/30 rounded-lg">
                <p>No tours available.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate demo data to see example tours.
                </p>
              </div>
            )}
            
            {isLoading && (
              <div className="col-span-2 text-center py-6 bg-muted/30 rounded-lg">
                <p>Loading tour data...</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourSelectionPanel;
