import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Eye, Users, TrendingUp, BarChart3, MessageSquare, Star } from 'lucide-react';
import { ComprehensiveFeedback } from '../types/ComprehensiveFeedback';
import { useSupabaseTours } from '../hooks/useSupabaseTours';
import { useSupabaseFeedback } from '../hooks/useSupabaseFeedback';
import { getRatingColor, getRatingDescription } from '../utils/feedbackUtils';

interface UnifiedFeedbackViewerProps {
  initialView?: 'overview' | 'tour-list' | 'individual';
  initialTourId?: string;
  initialFeedbackId?: string;
  showAnalytics?: boolean;
}

type ViewState = 'overview' | 'tour-list' | 'individual' | 'analytics';

const UnifiedFeedbackViewer: React.FC<UnifiedFeedbackViewerProps> = ({
  initialView = 'overview',
  initialTourId,
  initialFeedbackId,
  showAnalytics = true
}) => {
  const { tours, fetchTours } = useSupabaseTours();
  const { feedback, fetchAllFeedback, fetchFeedbackByTour } = useSupabaseFeedback();
  
  const [currentView, setCurrentView] = useState<ViewState>(initialView);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<ComprehensiveFeedback | null>(null);
  const [tourFeedback, setTourFeedback] = useState<ComprehensiveFeedback[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (initialTourId && tours.length > 0) {
      const tour = tours.find(t => t.id === initialTourId);
      if (tour) {
        handleTourSelect(tour);
      }
    }
  }, [initialTourId, tours]);

  useEffect(() => {
    if (initialFeedbackId && feedback.length > 0) {
      const fb = feedback.find(f => f.id === initialFeedbackId);
      if (fb) {
        handleFeedbackSelect(fb);
      }
    }
  }, [initialFeedbackId, feedback]);

  const loadData = async () => {
    await fetchTours();
    await fetchAllFeedback();
  };

  const handleTourSelect = async (tour: any) => {
    setSelectedTour(tour);
    const tourFb = await fetchFeedbackByTour(tour.id);
    setTourFeedback(tourFb || []);
    setCurrentView('tour-list');
  };

  const handleFeedbackSelect = (fb: ComprehensiveFeedback) => {
    setSelectedFeedback(fb);
    setCurrentView('individual');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedTour(null);
    setSelectedFeedback(null);
    setTourFeedback([]);
  };

  const handleBackToTourList = () => {
    setCurrentView('tour-list');
    setSelectedFeedback(null);
  };

  const renderBreadcrumb = () => {
    switch (currentView) {
      case 'overview':
        return <h1 className="text-2xl font-bold">Feedback Overview</h1>;
      case 'tour-list':
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBackToOverview}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-2xl font-bold">{selectedTour?.tour_name || 'Tour Feedback'}</h1>
          </div>
        );
      case 'individual':
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBackToOverview}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <Button variant="ghost" size="sm" onClick={handleBackToTourList}>
              {selectedTour?.tour_name || 'Tour'}
            </Button>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-2xl font-bold">{selectedFeedback?.client_name || 'Client Feedback'}</h1>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBackToOverview}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          </div>
        );
      default:
        return null;
    }
  };

  const renderOverview = () => {
    // Group feedback by tour
    const feedbackByTour = feedback.reduce((acc, item) => {
      const tourId = item.tour_id;
      if (!acc[tourId]) {
        acc[tourId] = [];
      }
      acc[tourId].push(item);
      return acc;
    }, {} as Record<string, ComprehensiveFeedback[]>);

    const tourStats = Object.entries(feedbackByTour).map(([tourId, tourFb]) => {
      const tour = tours.find(t => t.id === tourId);
      const avgRating = tourFb.reduce((sum, fb) => sum + (fb.overall_rating || fb.overview_rating || 0), 0) / tourFb.length;
      
      return {
        tour,
        feedback: tourFb,
        count: tourFb.length,
        avgRating: avgRating || 0
      };
    });

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedback.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tours with Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tourStats.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedback.length > 0 
                  ? (feedback.reduce((sum, fb) => sum + (fb.overall_rating || fb.overview_rating || 0), 0) / feedback.length).toFixed(1)
                  : '0.0'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tour Feedback Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tourStats.map(({ tour, feedback: tourFb, count, avgRating }) => (
                <div key={tour?.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{tour?.tour_name || 'Unknown Tour'}</h3>
                    <p className="text-sm text-muted-foreground">{tour?.tour_code}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{count} feedback entries</span>
                      <Badge variant="outline" className={getRatingColor(avgRating)}>
                        {avgRating.toFixed(1)}/7 - {getRatingDescription(avgRating)}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTourSelect(tour)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTourList = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Feedback for {selectedTour?.tour_name}</h2>
          <Badge variant="outline">
            {tourFeedback.length} entries
          </Badge>
        </div>
        
        <div className="grid gap-4">
          {tourFeedback.map((fb, index) => (
            <Card key={fb.id || index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{fb.client_name || 'Anonymous'}</h3>
                      <Badge variant="outline" className={getRatingColor(fb.overall_rating || fb.overview_rating || 0)}>
                        {(fb.overall_rating || fb.overview_rating || 0).toFixed(1)}/7
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {fb.client_email && <div>Email: {fb.client_email}</div>}
                      {fb.submitted_at && (
                        <div>Submitted: {new Date(fb.submitted_at).toLocaleDateString()}</div>
                      )}
                    </div>
                    {(fb.highlights || fb.improvements) && (
                      <div className="text-sm">
                        {fb.highlights && (
                          <p><span className="font-medium">Highlights:</span> {fb.highlights}</p>
                        )}
                        {fb.improvements && (
                          <p><span className="font-medium">Improvements:</span> {fb.improvements}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFeedbackSelect(fb)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderIndividual = () => {
    if (!selectedFeedback) return null;

    const renderRating = (value: number, label: string) => {
      if (!value || value <= 0) return null;
      
      return (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="font-medium">{label}</span>
          <Badge variant="outline" className={getRatingColor(value)}>
            {value}/7 - {getRatingDescription(value)}
          </Badge>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Name:</strong> {selectedFeedback.client_name}</div>
            {selectedFeedback.client_email && (
              <div><strong>Email:</strong> {selectedFeedback.client_email}</div>
            )}
            {selectedFeedback.client_phone && (
              <div><strong>Phone:</strong> {selectedFeedback.client_phone}</div>
            )}
            {selectedFeedback.submitted_at && (
              <div><strong>Submitted:</strong> {new Date(selectedFeedback.submitted_at).toLocaleString()}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {renderRating(selectedFeedback.overall_rating || selectedFeedback.overview_rating || 0, 'Overall Rating')}
            {renderRating(selectedFeedback.accommodation_rating || 0, 'Accommodation')}
            {renderRating(selectedFeedback.food_rating || 0, 'Food')}
            {renderRating(selectedFeedback.guide_rating || 0, 'Guide')}
            {renderRating(selectedFeedback.driver_rating || 0, 'Driver')}
            {renderRating(selectedFeedback.vehicle_rating || 0, 'Vehicle')}
          </CardContent>
        </Card>

        {(selectedFeedback.highlights || selectedFeedback.improvements || selectedFeedback.additional_comments) && (
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedFeedback.highlights && (
                <div>
                  <h4 className="font-medium mb-2">Highlights</h4>
                  <p className="text-sm text-muted-foreground">{selectedFeedback.highlights}</p>
                </div>
              )}
              {selectedFeedback.improvements && (
                <div>
                  <h4 className="font-medium mb-2">Improvements</h4>
                  <p className="text-sm text-muted-foreground">{selectedFeedback.improvements}</p>
                </div>
              )}
              {selectedFeedback.additional_comments && (
                <div>
                  <h4 className="font-medium mb-2">Additional Comments</h4>
                  <p className="text-sm text-muted-foreground">{selectedFeedback.additional_comments}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderAnalytics = () => {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
          <p className="text-muted-foreground">Advanced analytics and insights coming soon...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderBreadcrumb()}
      
      {currentView === 'overview' && renderOverview()}
      {currentView === 'tour-list' && renderTourList()}
      {currentView === 'individual' && renderIndividual()}
      {currentView === 'analytics' && showAnalytics && renderAnalytics()}
    </div>
  );
};

export default UnifiedFeedbackViewer;
