import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, User, ArrowLeft, Eye } from 'lucide-react';
import { useSupabaseTours } from '@/hooks/useSupabaseTours';
import { useSupabaseFeedback } from '@/hooks/useSupabaseFeedback';

const TourFeedbackSessionPage: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const { tours, fetchTours } = useSupabaseTours();
  const { feedback, fetchFeedbackByTour } = useSupabaseFeedback();

  const [currentTour, setCurrentTour] = React.useState<any>(null);

  React.useEffect(() => {
    if (tourId) {
      fetchTours();
      fetchFeedbackByTour(tourId);
    }
  }, [tourId, fetchTours, fetchFeedbackByTour]);

  React.useEffect(() => {
    if (tours.length > 0 && tourId) {
      const tour = tours.find(t => t.id === tourId);
      setCurrentTour(tour);
    }
  }, [tours, tourId]);

  const handleStartNewFeedback = () => {
    navigate(`/tour/${tourId}/feedback/new`);
  };

  const handleViewFeedback = (feedbackId: string) => {
    navigate(`/feedback-management?view=individual&tourId=${tourId}&feedbackId=${feedbackId}`);
  };

  if (!currentTour) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading tour details...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/feedback')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tours
        </Button>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Tour Feedback Session</h1>
          <div className="text-muted-foreground">Collect client feedback for this tour</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tour Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tour Code</label>
                <div className="font-semibold">{currentTour.tour_code}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tour Name</label>
                <div>{currentTour.tour_name}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Guide</label>
                <div>{currentTour.guide?.full_name || currentTour.guide_name || 'N/A'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Driver</label>
                <div>{currentTour.driver?.full_name || currentTour.driver_name || 'N/A'}</div>
              </div>
              {currentTour.truck_name && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vehicle</label>
                  <div>{currentTour.truck_name}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Client Feedback Collection
                <Button onClick={handleStartNewFeedback} className="bg-tour-primary hover:bg-tour-secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Client Feedback
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {feedback.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No feedback collected yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start collecting feedback from your tour clients.
                  </p>
                  <Button onClick={handleStartNewFeedback} className="bg-tour-primary hover:bg-tour-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Start First Client Feedback
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Collected Feedback ({feedback.length})</h3>
                  </div>
                  
                  <div className="grid gap-4">
                    {feedback.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-semibold">
                              {item.client_name || 'Anonymous Client'}
                            </div>
                            <Badge variant="secondary">
                              Rating: {item.overall_rating || item.overview_rating || 'N/A'}/5
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.client_email && (
                              <div>Email: {item.client_email}</div>
                            )}
                            {item.submitted_at && (
                              <div>Submitted: {new Date(item.submitted_at).toLocaleString()}</div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewFeedback(item.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TourFeedbackSessionPage;