import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';
import { Users, Eye, Calendar } from 'lucide-react';

interface TourFeedbackOverviewProps {
  feedback: ComprehensiveFeedback[];
  onViewTourFeedback: (tourId: string, tourName: string) => void;
}

const TourFeedbackOverview: React.FC<TourFeedbackOverviewProps> = ({
  feedback,
  onViewTourFeedback
}) => {
  // Group feedback by tour
  const groupedFeedback = feedback.reduce((acc, item) => {
    const tourId = item.tour_id;
    if (!acc[tourId]) {
      acc[tourId] = {
        tourId,
        tourName: `Tour ${tourId}`, // This could be enhanced with actual tour names
        feedback: []
      };
    }
    acc[tourId].feedback.push(item);
    return acc;
  }, {} as Record<string, { tourId: string; tourName: string; feedback: ComprehensiveFeedback[] }>);

  const tours = Object.values(groupedFeedback).sort((a, b) => 
    new Date(b.feedback[0].submitted_at || '').getTime() - 
    new Date(a.feedback[0].submitted_at || '').getTime()
  );

  const calculateAverageRating = (tourFeedback: ComprehensiveFeedback[]) => {
    const ratings = tourFeedback.map(f => f.overview_rating).filter(r => r > 0);
    return ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : 'N/A';
  };

  const getLatestSubmissionDate = (tourFeedback: ComprehensiveFeedback[]) => {
    const dates = tourFeedback
      .map(f => f.submitted_at)
      .filter(Boolean)
      .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime());
    
    return dates.length > 0 ? new Date(dates[0]!).toLocaleDateString() : 'Unknown';
  };

  if (tours.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No tour feedback available to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tour Feedback Overview</h2>
        <Badge variant="secondary">
          {tours.length} {tours.length === 1 ? 'Tour' : 'Tours'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {tours.map((tour) => (
          <Card key={tour.tourId} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {tour.tourName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {tour.feedback.length} {tour.feedback.length === 1 ? 'Client' : 'Clients'}
                  </Badge>
                  <Badge variant="default">
                    ★ {calculateAverageRating(tour.feedback)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Latest: {getLatestSubmissionDate(tour.feedback)}
                  </span>
                  <span>
                    Tour ID: {tour.tourId}
                  </span>
                </div>
                <Button 
                  onClick={() => onViewTourFeedback(tour.tourId, tour.tourName)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TourFeedbackOverview;