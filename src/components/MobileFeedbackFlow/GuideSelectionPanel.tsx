import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users, Calendar, User, Truck, Download, ShieldCheck } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import { useToast } from '../ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import ManualTourEntryDialog from './ManualTourEntryDialog';
import { tourService } from '../../services/api/tourService';
import { Tour } from '../../types/Tour';

const GuideSelectionPanel: React.FC = () => {
  const { tours, selectedTour, setSelectedTour, isLoading } = useAppContext();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tourToConfirm, setTourToConfirm] = useState<Tour | null>(null);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tours.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <CardTitle className="text-muted-foreground">No Tours Available</CardTitle>
          <CardDescription>
            Please generate demo data or create tours to begin collecting feedback
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Select Your Tour
          </span>
          <div className="flex items-center gap-2">
            <ManualTourEntryDialog onCreate={(tour) => {
              setSelectedTour(tour);
              toast({ title: 'Manual tour created', description: `${tour.tour_name}` });
            }} />
            <Button variant="outline" size={isMobile ? 'sm' : 'default'} onClick={async () => {
              const res = await tourService.downloadForOffline();
              toast({ title: 'Downloaded for offline', description: `${res.tours} tours and ${res.clients} clients cached` });
            }}>
              <Download className="h-4 w-4 mr-2" />
              Download for offline
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Choose the tour you are guiding to begin client feedback collection
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className={`space-y-3 ${isMobile ? 'max-h-96 overflow-y-auto' : ''}`}>
          {tours.map((tour) => (
            <div
              key={tour.tour_id}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md
                ${selectedTour?.tour_id === tour.tour_id 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border hover:border-primary/50'
                }
              `}
              onClick={() => setSelectedTour(tour)}
            >
              <div className="flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {tour.tour_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ID: {tour.tour_id}
                    </p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={isMobile ? 'text-xs' : ''}
                  >
                    Active
                  </Badge>
                </div>

                <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2 text-sm`}>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className={isMobile ? 'text-xs' : 'text-sm'}>
                      {new Date(tour.date_start).toLocaleDateString()} - {new Date(tour.date_end).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className={isMobile ? 'text-xs' : 'text-sm'}>
                      {tour.passenger_count} passengers
                    </span>
                  </div>
                </div>

                <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2 text-sm`}>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className={isMobile ? 'text-xs' : 'text-sm'}>
                      Guide: {tour.guide_name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span className={isMobile ? 'text-xs' : 'text-sm'}>
                      Driver: {tour.driver_name}
                    </span>
                  </div>
                </div>

                {selectedTour?.tour_id === tour.tour_id && (
                  <div className="pt-2 border-t">
                    <Button 
                      className="w-full"
                      size={isMobile ? "sm" : "default"}
                    >
                      Continue with this tour
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GuideSelectionPanel;