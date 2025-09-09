import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/use-toast';
import { offlineStorage, OfflineTour, OfflineFeedback } from '../services/offlineStorage';
import { useAutoSync } from '../hooks/useAutoSync';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Calendar,
  User,
  Star,
  CheckCircle,
  AlertCircle,
  Upload,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';

const MobileFeedbackSession: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tour, setTour] = useState<OfflineTour | null>(null);
  const [feedback, setFeedback] = useState<OfflineFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isSyncing, itemsToSync, manualSync, checkItemsToSync, isOnline } = useAutoSync();

  useEffect(() => {
    if (tourId) {
      loadTourData();
    }
  }, [tourId]);

  const loadTourData = async () => {
    if (!tourId) return;
    
    try {
      const tourData = await offlineStorage.getTour(tourId);
      if (!tourData) {
        toast({
          variant: "destructive",
          title: "Tour Not Found",
          description: "The requested tour could not be found."
        });
        navigate('/mobile');
        return;
      }
      
      setTour(tourData);
      
      const feedbackData = await offlineStorage.getFeedbackByTour(tourId);
      setFeedback(feedbackData);
      
      // Check for items to sync
      await checkItemsToSync();
    } catch (error) {
      console.error('Error loading tour data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tour data."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewFeedback = () => {
    if (!tour) return;
    navigate(`/mobile-feedback-form/${tour.offline_id}`);
  };

  const handleEndFeedbackCollection = async () => {
    if (!tour) return;
    
    if (feedback.length === 0) {
      toast({
        variant: "destructive",
        title: "No Feedback Collected",
        description: "Please collect at least one feedback before ending the session."
      });
      return;
    }

    // Mark tour as completed
    const updatedTour = { ...tour, status: 'completed' as const };
    await offlineStorage.saveTour(updatedTour);
    
    toast({
      title: "Feedback Collection Completed",
      description: `${feedback.length} feedback entries collected for ${tour.tour_code}.`
    });
    
    navigate('/mobile');
  };

  const handleReopenFeedbackCollection = async () => {
    if (!tour) return;
    
    // Mark tour as active again
    const updatedTour = { ...tour, status: 'active' as const };
    await offlineStorage.saveTour(updatedTour);
    
    toast({
      title: "Feedback Collection Reopened",
      description: `You can now add more feedback for ${tour.tour_code}.`
    });
    
    // Reload data to reflect changes
    await loadTourData();
  };

  const handleSync = async () => {
    console.log('🔄 Session sync button clicked');
    console.log('Network status:', { isOnline, connectionType: (navigator as any).connection?.effectiveType });
    
    const result = await manualSync();
    console.log('🔄 Session sync result:', result);
    
    if (result.success) {
      await loadTourData();
    }
  };

  const formatRating = (rating: number | null | undefined): string => {
    if (rating === null || rating === undefined) return 'N/A';
    return `${rating}/5`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-xl font-bold mb-4">Tour Not Found</h1>
        <Button onClick={() => navigate('/mobile')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-2xl">
      {/* Header with Back Button and Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/mobile')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{tour.tour_code}</h1>
            <p className="text-sm text-muted-foreground">{tour.tour_name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="w-4 h-4" />
              <span className="text-xs">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <WifiOff className="w-4 h-4" />
              <span className="text-xs">Offline</span>
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

      {/* Tour Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tour Details</span>
            <Badge variant={tour.status === 'completed' ? 'default' : 'secondary'}>
              {tour.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{tour.date_start}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{tour.guide_name}</span>
            </div>
          </div>
          {tour.driver_name && tour.driver_name !== 'No Driver' && (
            <div className="text-sm">
              <span className="text-muted-foreground">Driver: </span>
              {tour.driver_name}
            </div>
          )}
          {tour.truck_name && tour.truck_name !== 'No Vehicle' && (
            <div className="text-sm">
              <span className="text-muted-foreground">Vehicle: </span>
              {tour.truck_name}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Collection Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Client Feedback Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {feedback.length} feedback entries collected
            </span>
            <div className="flex gap-2">
              <Button 
                onClick={handleStartNewFeedback}
                disabled={tour.status === 'completed'}
              >
                <Plus className="w-4 h-4 mr-2" />
                {tour.status === 'completed' ? 'Collection Ended' : 'Add Client Feedback'}
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            {tour.status !== 'completed' ? (
              <Button 
                onClick={handleEndFeedbackCollection}
                variant="outline"
                className="flex-1"
                disabled={feedback.length === 0}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                End Feedback Collection
              </Button>
            ) : (
              <Button 
                onClick={handleReopenFeedbackCollection}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reopen Feedback Collection
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Collected Feedback</h2>
        
        {feedback.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No feedback collected yet. Start by adding your first client feedback.
              </p>
            </CardContent>
          </Card>
        ) : (
          feedback.map((item, index) => (
            <Card key={item.offline_id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{item.client_name}</span>
                      {!item.synced && (
                        <Badge variant="secondary" className="text-xs">
                          Not Synced
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">
                        Overall: {formatRating((item as any).overall_rating)}
                      </span>
                    </div>
                    
                    {item.client_email && (
                      <p className="text-xs text-muted-foreground">
                        {item.client_email}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(item.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-lg font-bold">#{index + 1}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MobileFeedbackSession;