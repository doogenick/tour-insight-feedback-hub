import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Play, Square, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { tourSupabaseService } from '../services/supabaseServices';
import { syncService } from '../services/syncService';
import { useToast } from './ui/use-toast';

interface Tour {
  id: string;
  tour_code: string;
  tour_name: string;
  feedback_gathering_status: 'inactive' | 'active' | 'completed';
  created_at: string;
  guide?: { full_name: string };
  driver?: { full_name: string };
}

const FeedbackGatheringManager: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const loadTours = async () => {
    setLoading(true);
    try {
      const data = await tourSupabaseService.getAllTours();
      setTours(data || []);
    } catch (error) {
      console.error('Error loading tours:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tours.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTours();
  }, []);

  const handleStartFeedbackGathering = async (tourId: string) => {
    setActionLoading(tourId);
    try {
      await tourSupabaseService.startFeedbackGathering(tourId);
      toast({
        title: "Success",
        description: "Feedback gathering started for this tour.",
      });
      await loadTours();
    } catch (error) {
      console.error('Error starting feedback gathering:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start feedback gathering.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEndFeedbackGathering = async (tourId: string) => {
    setActionLoading(tourId);
    try {
      // Use the sync service to end feedback gathering
      const result = await syncService.endTourFeedbackGathering(tourId);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
      
      await loadTours();
    } catch (error) {
      console.error('Error ending feedback gathering:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to end feedback gathering.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Square className="h-4 w-4" />;
    }
  };

  const activeTours = tours.filter(tour => tour.feedback_gathering_status === 'active');
  const completedTours = tours.filter(tour => tour.feedback_gathering_status === 'completed');
  const inactiveTours = tours.filter(tour => tour.feedback_gathering_status === 'inactive');

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading tours...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeTours.length}</div>
            <p className="text-xs text-muted-foreground">Collecting feedback</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{completedTours.length}</div>
            <p className="text-xs text-muted-foreground">Feedback gathered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{inactiveTours.length}</div>
            <p className="text-xs text-muted-foreground">Not collecting</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Tours */}
      {activeTours.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              Active Feedback Gathering
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTours.map((tour) => (
                <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{tour.tour_name}</h3>
                    <p className="text-sm text-muted-foreground">{tour.tour_code}</p>
                    <div className="flex items-center gap-4 text-sm">
                      {tour.guide && <span>Guide: {tour.guide.full_name}</span>}
                      {tour.driver && <span>Driver: {tour.driver.full_name}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(tour.feedback_gathering_status)}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleEndFeedbackGathering(tour.id)}
                      disabled={actionLoading === tour.id}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      {actionLoading === tour.id ? 'Ending...' : 'End & Sync'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inactive Tours */}
      {inactiveTours.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Square className="h-5 w-5 text-gray-600" />
              Inactive Tours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inactiveTours.map((tour) => (
                <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{tour.tour_name}</h3>
                    <p className="text-sm text-muted-foreground">{tour.tour_code}</p>
                    <div className="flex items-center gap-4 text-sm">
                      {tour.guide && <span>Guide: {tour.guide.full_name}</span>}
                      {tour.driver && <span>Driver: {tour.driver.full_name}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(tour.feedback_gathering_status)}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleStartFeedbackGathering(tour.id)}
                      disabled={actionLoading === tour.id}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {actionLoading === tour.id ? 'Starting...' : 'Start Feedback'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Tours */}
      {completedTours.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Completed Tours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedTours.map((tour) => (
                <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{tour.tour_name}</h3>
                    <p className="text-sm text-muted-foreground">{tour.tour_code}</p>
                    <div className="flex items-center gap-4 text-sm">
                      {tour.guide && <span>Guide: {tour.guide.full_name}</span>}
                      {tour.driver && <span>Driver: {tour.driver.full_name}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(tour.feedback_gathering_status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartFeedbackGathering(tour.id)}
                      disabled={actionLoading === tour.id}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {actionLoading === tour.id ? 'Starting...' : 'Restart'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Feedback Gathering Workflow:</strong><br/>
          1. <strong>Start Feedback</strong> - Makes tour available on mobile devices for feedback collection<br/>
          2. <strong>End & Sync</strong> - Syncs all mobile data to Supabase and removes tour from mobile devices<br/>
          3. <strong>Restart</strong> - Reopens a completed tour for additional feedback collection
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FeedbackGatheringManager;
