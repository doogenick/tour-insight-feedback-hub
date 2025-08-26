import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Users, Eye, FileText } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { FeedbackViewerContainer } from './FeedbackViewer';
import { Tour } from '../types/Tour';
import { Feedback } from '../types/Feedback';
import { ComprehensiveFeedback } from '../types/ComprehensiveFeedback';

const AdminFeedbackManagement: React.FC = () => {
  const { tours, feedback, fetchTours, fetchFeedback } = useAppContext();
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [tourFeedback, setTourFeedback] = useState<Feedback[]>([]);
  const [viewMode, setViewMode] = useState<'tour-list' | 'feedback-viewer'>('tour-list');

  useEffect(() => {
    fetchTours();
    fetchFeedback();
  }, [fetchTours, fetchFeedback]);

  // Group feedback by tour
  const feedbackByTour = feedback.reduce((acc, item) => {
    const tourId = item.tour_id;
    if (!acc[tourId]) {
      acc[tourId] = [];
    }
    acc[tourId].push(item);
    return acc;
  }, {} as Record<string, Feedback[]>);

  const handleViewTourFeedback = (tour: Tour) => {
    setSelectedTour(tour);
    const feedbackForTour = feedbackByTour[tour.tour_id] || [];
    setTourFeedback(feedbackForTour);
    setViewMode('feedback-viewer');
  };

  const handleBackToTourList = () => {
    setSelectedTour(null);
    setTourFeedback([]);
    setViewMode('tour-list');
  };

  const calculateAverageRating = (tourFeedback: Feedback[]) => {
    if (tourFeedback.length === 0) return 'N/A';
    const ratings = tourFeedback.map(f => f.rating_overall).filter(r => r > 0);
    return ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : 'N/A';
  };

  if (viewMode === 'feedback-viewer' && selectedTour) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleBackToTourList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tours
          </Button>
          <h2 className="text-xl font-bold">Feedback for {selectedTour.tour_name}</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tour Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Tour Code:</span>
                <p className="text-muted-foreground">{selectedTour.tour_id}</p>
              </div>
              <div>
                <span className="font-medium">Guide:</span>
                <p className="text-muted-foreground">{selectedTour.guide_name}</p>
              </div>
              <div>
                <span className="font-medium">Driver:</span>
                <p className="text-muted-foreground">{selectedTour.driver_name}</p>
              </div>
              <div>
                <span className="font-medium">Passengers:</span>
                <p className="text-muted-foreground">{selectedTour.passenger_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {tourFeedback.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Client Feedback ({tourFeedback.length})</h3>
            <div className="grid gap-4">
              {tourFeedback.map((fb, index) => (
                <Card key={fb.id || index}>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Client {index + 1}</p>
                          <p className="text-sm text-muted-foreground">ID: {fb.client_id}</p>
                        </div>
                        <Badge variant="default">★ {fb.rating_overall}/5</Badge>
                      </div>
                      {fb.comments && (
                        <div className="mt-2">
                          <p className="text-sm">
                            <span className="font-medium">Comments:</span> {fb.comments}
                          </p>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {fb.submitted_at && `Submitted: ${new Date(fb.submitted_at).toLocaleDateString()}`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No feedback available for this tour.</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Tour Feedback Management</h2>
          <p className="text-muted-foreground">
            Select a tour to view and manage client feedback for manual data capture
          </p>
        </div>
        <Badge variant="secondary">
          {tours.length} {tours.length === 1 ? 'Tour' : 'Tours'}
        </Badge>
      </div>

      {tours.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No tours available. Create tours first to manage feedback.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tours.map((tour) => {
            const tourFeedbackList = feedbackByTour[tour.tour_id] || [];
            const avgRating = calculateAverageRating(tourFeedbackList);
            
            return (
              <Card key={tour.tour_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {tour.tour_name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {tourFeedbackList.length} {tourFeedbackList.length === 1 ? 'Client' : 'Clients'}
                      </Badge>
                      {tourFeedbackList.length > 0 && (
                        <Badge variant="default">
                          ★ {avgRating}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <span>ID: {tour.tour_id}</span>
                      <span>Guide: {tour.guide_name}</span>
                      <span>Driver: {tour.driver_name}</span>
                      <span>Passengers: {tour.passenger_count}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {tour.date_start && (
                          <span>Start: {new Date(tour.date_start).toLocaleDateString()}</span>
                        )}
                      </div>
                      <Button 
                        onClick={() => handleViewTourFeedback(tour)}
                        variant="outline"
                        size="sm"
                        disabled={tourFeedbackList.length === 0}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {tourFeedbackList.length === 0 ? 'No Feedback' : 'View Feedback'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackManagement;