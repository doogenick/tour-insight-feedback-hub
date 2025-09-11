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
import { 
  getDisplayValue, 
  getPrimaryRating, 
  getClientPhone, 
  getClientNationality,
  getTourHighlights,
  getImprovementSuggestions,
  getExpectationsMet,
  getLikelyToReturn,
  getGuideRating,
  getDriverRating,
  getFoodRating,
  getVehicleRating,
  formatRating
} from '../utils/feedbackUtils';

type SupabaseFeedback = Database['public']['Tables']['comprehensive_feedback']['Row'] & {
  tour?: Database['public']['Tables']['tours']['Row'];
};

const AdminFeedbackManagement: React.FC = () => {
  const { tours, fetchTours } = useSupabaseTours();
  const { feedback, fetchAllFeedback, fetchFeedbackByTour } = useSupabaseFeedback();
  const [viewMode, setViewMode] = useState<'tour-list' | 'detailed-viewer' | 'individual-feedback'>('tour-list');
  const [allFeedback, setAllFeedback] = useState<any[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [tourFeedback, setTourFeedback] = useState<any[]>([]);

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
    setSelectedTour(null); // Show all feedback when not filtering by tour
  };

  const handleBackToTourList = () => {
    setViewMode('tour-list');
    setSelectedTour(null);
    setTourFeedback([]);
  };

  const handleTourSelect = async (tour: Tour) => {
    setSelectedTour(tour);
    const feedback = await fetchFeedbackByTour(tour.tour_id);
    setTourFeedback(feedback || []);
    setViewMode('detailed-viewer');
  };

  const handleViewIndividualFeedback = (feedback: any) => {
    setSelectedFeedback(feedback);
    setViewMode('individual-feedback');
  };

  const handleBackToTourFeedback = () => {
    setViewMode('detailed-viewer');
    setSelectedFeedback(null);
  };

  const calculateAverageRating = (tourFeedback: any[]) => {
    if (tourFeedback.length === 0) return 'N/A';
    const ratings = tourFeedback.map(f => getPrimaryRating(f)).filter(r => r > 0);
    return ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : 'N/A';
  };

  // Show individual feedback detail
  if (viewMode === 'individual-feedback' && selectedFeedback) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleBackToTourFeedback}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tour Feedback
          </Button>
          <h2 className="text-xl font-bold">Individual Feedback Detail</h2>
        </div>
        
        <AdminFeedbackDetail feedback={selectedFeedback} onClose={handleBackToTourFeedback} />
      </div>
    );
  }

  // Show detailed feedback viewer (tour-specific)
  if (viewMode === 'detailed-viewer') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleBackToTourList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tour List
          </Button>
          <h2 className="text-xl font-bold">
            {selectedTour ? `Feedback for ${selectedTour.tour_name} (${selectedTour.tour_code})` : 'Individual Feedback Reviews'}
          </h2>
        </div>
        
        <div className="space-y-4">
          {(selectedTour ? tourFeedback : allFeedback).length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  {selectedTour ? 'No feedback submissions for this tour yet.' : 'No feedback submissions available yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            (selectedTour ? tourFeedback : allFeedback).map((feedback, index) => (
              <div key={feedback.id || index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div className="space-y-1">
                  <p className="font-medium">
                    {feedback.client_name || `Client ${index + 1}`}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{feedback.client_email || 'No email provided'}</span>
                    <span>{feedback.tour?.tour_code || feedback.tour_id}</span>
                    <span>{formatRating(getPrimaryRating(feedback))}</span>
                    <span>
                      {feedback.submitted_at 
                        ? new Date(feedback.submitted_at).toLocaleDateString()
                        : 'No date'
                      }
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewIndividualFeedback(feedback)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
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
                          {avgRating}
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
                        onClick={() => handleTourSelect(tour)}
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