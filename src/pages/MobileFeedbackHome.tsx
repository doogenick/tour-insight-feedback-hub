import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { offlineStorage, OfflineTour } from '../services/offlineStorage';
import { useToast } from '../components/ui/use-toast';
import { useAutoSync } from '../hooks/useAutoSync';
import ManualTourEntryDialog from '../components/MobileFeedbackFlow/ManualTourEntryDialog';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Plus, 
  Users, 
  Calendar,
  Upload,
  AlertCircle,
  CheckCircle 
} from 'lucide-react';

const MobileFeedbackHome: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tours, setTours] = useState<OfflineTour[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isSyncing, itemsToSync, manualSync, checkItemsToSync, refreshTourData, isOnline } = useAutoSync();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedTours = await offlineStorage.getTours();
      setTours(storedTours);
      
      await checkItemsToSync();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTourCreated = async (tour: any) => {
    const offlineTour: OfflineTour = {
      ...tour,
      offline_id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      synced: false,
      created_offline: true
    };
    
    await offlineStorage.saveTour(offlineTour);
    await loadData();
    
    // Navigate to feedback collection
    navigate(`/mobile-feedback/${offlineTour.offline_id}`);
  };

  const handleSync = async () => {
    console.log('🔄 Sync button clicked');
    console.log('Network status:', { isOnline, connectionType: (navigator as any).connection?.effectiveType });
    
    const result = await manualSync();
    console.log('🔄 Sync result:', result);
    
    if (result.success) {
      // Refresh tour data after successful sync
      await loadData();
    }
  };

  const handleTourClick = (tour: OfflineTour) => {
    navigate(`/mobile-feedback/${tour.offline_id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const activeTours = tours.filter(tour => tour.status !== 'completed');
  const completedTours = tours.filter(tour => tour.status === 'completed');

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-2xl">
      {/* Connection Status */}
      <div className="flex items-center justify-center gap-2 text-sm">
        {isOnline ? (
          <div className="flex items-center gap-2 text-green-600">
            <Wifi className="w-4 h-4" />
            <span>Connected</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-600">
            <WifiOff className="w-4 h-4" />
            <span>Offline</span>
          </div>
        )}
      </div>

      {/* Active Tours */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Active Tours</h2>
        
        {activeTours.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Active Tours</p>
                <p className="text-sm">Create a new tour to start collecting feedback</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          activeTours.map((tour) => (
            <Card 
              key={tour.offline_id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTourClick(tour)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{tour.tour_code}</h3>
                      {!tour.synced && (
                        <Badge variant="secondary" className="text-xs">
                          Not Synced
                        </Badge>
                      )}
                      {tour.synced && (
                        <Badge variant="default" className="text-xs">
                          Synced
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {tour.tour_name}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {tour.date_start}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Guide: {tour.guide_name}
                      </div>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {tour.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create New Tour */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Tour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ManualTourEntryDialog onCreate={handleTourCreated} />
        </CardContent>
      </Card>

      {/* Completed Tours */}
      {completedTours.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Completed Tours</h2>
          
          {completedTours.map((tour) => (
            <Card 
              key={tour.offline_id} 
              className="cursor-pointer hover:shadow-md transition-shadow opacity-75"
              onClick={() => handleTourClick(tour)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{tour.tour_code}</h3>
                      {!tour.synced && (
                        <Badge variant="secondary" className="text-xs">
                          Not Synced
                        </Badge>
                      )}
                      {tour.synced && (
                        <Badge variant="default" className="text-xs">
                          Synced
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                        Completed
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {tour.tour_name}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {tour.date_start}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Guide: {tour.guide_name}
                      </div>
                    </div>
                  </div>
                  
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Sync Status - Moved below completed tours */}
      {itemsToSync > 0 && (
        <div className="mt-6">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <div>
                    <span className="text-xs font-medium">
                      {itemsToSync} items waiting to sync
                    </span>
                    <p className="text-xs text-orange-700 mt-1">
                      {isOnline ? 'Tap to sync now' : 'Connect to internet to sync'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSync}
                  disabled={!isOnline || isSyncing}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  {isSyncing ? (
                    <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                  ) : (
                    <Upload className="w-3 h-3 mr-1" />
                  )}
                  {isSyncing ? 'Syncing...' : 'Sync'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Message */}
      {itemsToSync === 0 && tours.length > 0 && (
        <div className="mt-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">
                  All data synced successfully
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MobileFeedbackHome;