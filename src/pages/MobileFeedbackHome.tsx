import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useWifiConnection } from '../hooks/useWifiConnection';
import { offlineStorage, OfflineTour } from '../services/offlineStorage';
import { syncService } from '../services/syncService';
import { useToast } from '../components/ui/use-toast';
import ManualTourEntryDialog from '../components/MobileFeedbackFlow/ManualTourEntryDialog';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Plus, 
  Users, 
  Calendar,
  Upload,
  AlertCircle 
} from 'lucide-react';

const MobileFeedbackHome: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline, connectionType } = useWifiConnection();
  const { toast } = useToast();
  
  const [tours, setTours] = useState<OfflineTour[]>([]);
  const [itemsToSync, setItemsToSync] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedTours = await offlineStorage.getTours();
      setTours(storedTours);
      
      const unsyncedCount = await syncService.getItemsToSync();
      setItemsToSync(unsyncedCount);
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
    if (!isOnline) {
      toast({
        variant: "destructive",
        title: "No Internet Connection",
        description: "Please connect to the internet to sync your data."
      });
      return;
    }

    setIsSyncing(true);
    try {
      const result = await syncService.syncToSupabase();
      
      if (result.success) {
        toast({
          title: "Sync Successful",
          description: result.message
        });
        await loadData();
      } else {
        toast({
          variant: "destructive",
          title: "Sync Failed",
          description: result.message
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "An error occurred while syncing data."
      });
    } finally {
      setIsSyncing(false);
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

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Safari Feedback Collection</h1>
        <div className="flex items-center justify-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">Online ({connectionType})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm">Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Sync Status */}
      {itemsToSync > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium">
                  {itemsToSync} items waiting to sync
                </span>
              </div>
              <Button
                onClick={handleSync}
                disabled={!isOnline || isSyncing}
                size="sm"
                variant="outline"
              >
                {isSyncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Tour */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Start New Feedback Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Create a new tour to start collecting client feedback
          </p>
          <ManualTourEntryDialog onCreate={handleTourCreated} />
        </CardContent>
      </Card>

      {/* Recent Tours */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Tours</h2>
        
        {tours.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No tours created yet. Start by creating your first tour above.
              </p>
            </CardContent>
          </Card>
        ) : (
          tours.map((tour) => (
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
    </div>
  );
};

export default MobileFeedbackHome;