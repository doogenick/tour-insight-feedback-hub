import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Users, Eye, FileText } from 'lucide-react';
import { useSupabaseTours } from '../hooks/useSupabaseTours';
import { useSupabaseFeedback } from '../hooks/useSupabaseFeedback';
import { Tour } from '../types/Tour';

const AdminFeedbackManagement: React.FC = () => {
  const { tours, fetchTours } = useSupabaseTours();
  const { feedback, fetchAllFeedback, fetchFeedbackByTour } = useSupabaseFeedback();
  const [selectedTour, setSelectedTour] = useState<any | null>(null);
  const [tourFeedback, setTourFeedback] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'tour-list' | 'feedback-viewer'>('tour-list');
  const [allFeedback, setAllFeedback] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchTours();
    const feedbackData = await fetchAllFeedback();
    setAllFeedback(feedbackData || []);
  };

  // Group feedback by tour
  const feedbackByTour = allFeedback.reduce((acc, item) => {
    const tourId = item.tour_id;
    if (!acc[tourId]) {
      acc[tourId] = [];
    }
    acc[tourId].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const handleViewTourFeedback = async (tour: any) => {
    setSelectedTour(tour);
    const feedbackForTour = await fetchFeedbackByTour(tour.id);
    setTourFeedback(feedbackForTour || []);
    setViewMode('feedback-viewer');
  };

  const handleBackToTourList = () => {
    setSelectedTour(null);
    setTourFeedback([]);
    setViewMode('tour-list');
  };

  const calculateAverageRating = (tourFeedback: any[]) => {
    if (tourFeedback.length === 0) return 'N/A';
    const ratings = tourFeedback.map(f => f.overall_rating).filter(r => r > 0);
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
                <p className="text-muted-foreground">{selectedTour.tour_code}</p>
              </div>
              <div>
                <span className="font-medium">Guide:</span>
                <p className="text-muted-foreground">{selectedTour.guide?.full_name || 'Not assigned'}</p>
              </div>
              <div>
                <span className="font-medium">Driver:</span>
                <p className="text-muted-foreground">{selectedTour.driver?.full_name || 'Not assigned'}</p>
              </div>
              <div>
                <span className="font-medium">Passengers:</span>
                <p className="text-muted-foreground">{selectedTour.passenger_count}</p>
              </div>
              <div>
                <span className="font-medium">Truck Name:</span>
                <p className="text-muted-foreground">{selectedTour.truck_name}</p>
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
                     <div className="space-y-4">
                      {/* Client Header */}
                      <div className="flex justify-between items-start border-b pb-3">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-lg">{fb.lead_client_name || `Client ${index + 1}`}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {fb.client_nationality && <span>Nationality: {fb.client_nationality}</span>}
                            {fb.client_email && <span>Email: {fb.client_email}</span>}
                            {fb.group_size && <span>Group size: {fb.group_size}</span>}
                          </div>
                        </div>
                        <Badge variant="default" className="text-lg px-3 py-1">★ {fb.overall_rating}/5</Badge>
                      </div>
                      
                      {/* Rating Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm text-muted-foreground">SERVICE RATINGS</h5>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span>Accommodation:</span>
                              <Badge variant="outline">{fb.accommodation_rating}/5</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Activities:</span>
                              <Badge variant="outline">{fb.activities_rating}/5</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Food:</span>
                              <Badge variant="outline">{fb.food_rating}/5</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Vehicle:</span>
                              <Badge variant="outline">{fb.vehicle_rating}/5</Badge>
                            </div>
                          </div>
                        </div>
                        
                        {(fb.guide_rating || fb.driver_rating) && (
                          <div className="space-y-2">
                            <h5 className="font-medium text-sm text-muted-foreground">CREW RATINGS</h5>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              {fb.guide_rating && (
                                <div className="flex justify-between">
                                  <span>Guide:</span>
                                  <Badge variant="outline">{fb.guide_rating}/5</Badge>
                                </div>
                              )}
                              {fb.driver_rating && (
                                <div className="flex justify-between">
                                  <span>Driver:</span>
                                  <Badge variant="outline">{fb.driver_rating}/5</Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Written Feedback */}
                      {(fb.enjoyed_most || fb.improvements || fb.additional_comments) && (
                        <div className="space-y-3 border-t pt-3">
                          <h5 className="font-medium text-sm text-muted-foreground">WRITTEN FEEDBACK</h5>
                          {fb.enjoyed_most && (
                            <div className="space-y-1">
                              <span className="font-medium text-green-600">What they enjoyed most:</span>
                              <p className="text-sm bg-green-50 p-3 rounded border-l-4 border-green-200">{fb.enjoyed_most}</p>
                            </div>
                          )}
                          {fb.improvements && (
                            <div className="space-y-1">
                              <span className="font-medium text-orange-600">Suggested improvements:</span>
                              <p className="text-sm bg-orange-50 p-3 rounded border-l-4 border-orange-200">{fb.improvements}</p>
                            </div>
                          )}
                          {fb.additional_comments && (
                            <div className="space-y-1">
                              <span className="font-medium text-blue-600">Additional comments:</span>
                              <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-200">{fb.additional_comments}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Footer */}
                      <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-2">
                        <span>{fb.created_at && `Submitted: ${new Date(fb.created_at).toLocaleString()}`}</span>
                        {fb.recommend_to_friend !== undefined && (
                          <span className={fb.recommend_to_friend ? "text-green-600" : "text-red-600"}>
                            {fb.recommend_to_friend ? "Would recommend ✓" : "Would not recommend ✗"}
                          </span>
                        )}
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
            const tourFeedbackList = feedbackByTour[tour.id] || [];
            const avgRating = calculateAverageRating(tourFeedbackList);
            
            return (
              <Card key={tour.id} className="hover:shadow-md transition-shadow">
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <span>Code: {tour.tour_code}</span>
                      <span>Guide: {tour.guide?.full_name || 'Not assigned'}</span>
                      <span>Driver: {tour.driver?.full_name || 'Not assigned'}</span>
                      <span>Passengers: {tour.passenger_count}</span>
                      <span>Truck: {tour.truck_name}</span>
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