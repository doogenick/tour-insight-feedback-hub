import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Users, Eye, FileText } from 'lucide-react';
import { useSupabaseTours } from '../hooks/useSupabaseTours';
import { useSupabaseFeedback } from '../hooks/useSupabaseFeedback';
import AdminFeedbackDetail from './AdminFeedbackDetail';
import { Tour } from '../types/Tour';
import { Database } from '../integrations/supabase/types';

type SupabaseFeedback = Database['public']['Tables']['comprehensive_feedback']['Row'] & {
  tour?: Database['public']['Tables']['tours']['Row'];
};

const AdminFeedbackManagement: React.FC = () => {
  const { tours, fetchTours } = useSupabaseTours();
  const { feedback, fetchAllFeedback, fetchFeedbackByTour } = useSupabaseFeedback();
  const [viewMode, setViewMode] = useState<'tour-list' | 'detailed-viewer'>('tour-list');
  const [allFeedback, setAllFeedback] = useState<any[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

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

  const handleViewDetailedFeedback = () => {
    setViewMode('detailed-viewer');
  };

  const handleBackToTourList = () => {
    setViewMode('tour-list');
  };

  const calculateAverageRating = (tourFeedback: any[]) => {
    if (tourFeedback.length === 0) return 'N/A';
    const ratings = tourFeedback.map(f => f.overall_rating).filter(r => r > 0);
    return ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : 'N/A';
  };

  // Show detailed feedback viewer
  if (viewMode === 'detailed-viewer') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleBackToTourList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tour List
          </Button>
          <h2 className="text-xl font-bold">Individual Feedback Reviews</h2>
        </div>
        
        <div className="space-y-4">
          {allFeedback.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No feedback submissions available yet.</p>
              </CardContent>
            </Card>
          ) : (
            allFeedback.map((feedback, index) => (
              <Card key={feedback.id || index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{feedback.client_name}</span>
                    <Badge variant="default" className="text-lg px-3 py-1">
                      ★ {feedback.overall_rating}/5
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Client Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-sm text-muted-foreground mb-2">CLIENT INFORMATION</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Name:</span>
                          <span className="font-medium">{feedback.client_name}</span>
                        </div>
                        {feedback.client_email && (
                          <div className="flex justify-between">
                            <span>Email:</span>
                            <span className="font-medium">{feedback.client_email}</span>
                          </div>
                        )}
                        {feedback.client_phone && (
                          <div className="flex justify-between">
                            <span>Phone:</span>
                            <span className="font-medium">{feedback.client_phone}</span>
                          </div>
                        )}
                        {feedback.client_nationality && (
                          <div className="flex justify-between">
                            <span>Nationality:</span>
                            <span className="font-medium">{feedback.client_nationality}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-muted-foreground mb-2">SUBMISSION DETAILS</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Submitted:</span>
                          <span className="font-medium">
                            {new Date(feedback.submitted_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tour ID:</span>
                          <span className="font-medium">{feedback.tour_id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm text-muted-foreground">SERVICE RATINGS</h5>
                      <div className="space-y-2">
                        {feedback.accommodation_rating && (
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="font-medium">Accommodation</span>
                            <Badge variant="outline">{feedback.accommodation_rating}/5</Badge>
                          </div>
                        )}
                        {feedback.food_rating && (
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="font-medium">Food</span>
                            <Badge variant="outline">{feedback.food_rating}/5</Badge>
                          </div>
                        )}
                        {feedback.vehicle_rating && (
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="font-medium">Vehicle</span>
                            <Badge variant="outline">{feedback.vehicle_rating}/5</Badge>
                          </div>
                        )}
                        {feedback.value_rating && (
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="font-medium">Value for Money</span>
                            <Badge variant="outline">{feedback.value_rating}/5</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm text-muted-foreground">CREW RATINGS</h5>
                      <div className="space-y-2">
                        {feedback.guide_rating && (
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="font-medium">Guide Performance</span>
                            <Badge variant="outline">{feedback.guide_rating}/5</Badge>
                          </div>
                        )}
                        {feedback.driver_rating && (
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="font-medium">Driver Performance</span>
                            <Badge variant="outline">{feedback.driver_rating}/5</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Satisfaction Metrics */}
                  {(feedback.tour_expectations_met !== null || feedback.would_recommend !== null || feedback.likely_to_return !== null) && (
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm text-muted-foreground">SATISFACTION METRICS</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {feedback.tour_expectations_met !== null && (
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="font-medium">Met Expectations</span>
                            <Badge variant={feedback.tour_expectations_met ? "default" : "destructive"}>
                              {feedback.tour_expectations_met ? "Yes" : "No"}
                            </Badge>
                          </div>
                        )}
                        {feedback.would_recommend !== null && (
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="font-medium">Would Recommend</span>
                            <Badge variant={feedback.would_recommend ? "default" : "destructive"}>
                              {feedback.would_recommend ? "Yes" : "No"}
                            </Badge>
                          </div>
                        )}
                        {feedback.likely_to_return !== null && (
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="font-medium">Likely to Return</span>
                            <Badge variant={feedback.likely_to_return ? "default" : "destructive"}>
                              {feedback.likely_to_return ? "Yes" : "No"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Written Feedback */}
                  {(feedback.highlights || feedback.improvements || feedback.additional_comments) && (
                    <div className="space-y-4">
                      <h5 className="font-medium text-sm text-muted-foreground">WRITTEN FEEDBACK</h5>
                      {feedback.highlights && (
                        <div className="space-y-2">
                          <span className="font-medium text-green-600">Tour Highlights</span>
                          <p className="text-sm bg-green-50 p-4 rounded-lg border-l-4 border-green-200">
                            {feedback.highlights}
                          </p>
                        </div>
                      )}
                      {feedback.improvements && (
                        <div className="space-y-2">
                          <span className="font-medium text-orange-600">Suggested Improvements</span>
                          <p className="text-sm bg-orange-50 p-4 rounded-lg border-l-4 border-orange-200">
                            {feedback.improvements}
                          </p>
                        </div>
                      )}
                      {feedback.additional_comments && (
                        <div className="space-y-2">
                          <span className="font-medium text-blue-600">Additional Comments</span>
                          <p className="text-sm bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200">
                            {feedback.additional_comments}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {!feedback.highlights && !feedback.improvements && !feedback.additional_comments && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No written feedback provided
                    </div>
                   )}
                   
                   {/* Detailed View Button */}
                   <div className="pt-4 border-t">
                     <Button 
                       variant="outline" 
                       onClick={() => setSelectedFeedback(feedback)}
                       className="w-full"
                     >
                       <Eye className="h-4 w-4 mr-2" />
                       View Complete Details
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             ))
           )}
         </div>

         {selectedFeedback && (
           <AdminFeedbackDetail 
             feedback={selectedFeedback} 
             onClose={() => setSelectedFeedback(null)} 
           />
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
            View detailed feedback submissions with comprehensive client data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            {allFeedback.length} {allFeedback.length === 1 ? 'Feedback' : 'Feedbacks'}
          </Badge>
          <Button onClick={handleViewDetailedFeedback} disabled={allFeedback.length === 0}>
            <Eye className="h-4 w-4 mr-2" />
            View Individual Reviews
          </Button>
        </div>
      </div>

      {allFeedback.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No feedback submissions available yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Feedback will appear here once clients submit comprehensive forms.
            </p>
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
                        onClick={handleViewDetailedFeedback}
                        variant="outline"
                        size="sm"
                        disabled={tourFeedbackList.length === 0}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {tourFeedbackList.length === 0 ? 'No Feedback' : `View ${tourFeedbackList.length} Reviews`}
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