
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, Users, MessageSquare, Eye, Edit } from 'lucide-react';
import { Tour } from '../../services/api/types';
import { useSupabaseFeedback } from '../../hooks/useSupabaseFeedback';

interface MobileTourCardProps {
  tour: Tour;
  onSelect: (tour: Tour) => void;
  onViewFeedback?: (tour: Tour) => void;
  onEdit?: (tour: Tour) => void;
}

const MobileTourCard: React.FC<MobileTourCardProps> = ({ tour, onSelect, onViewFeedback, onEdit }) => {
  const { fetchFeedbackByTour } = useSupabaseFeedback();
  const [feedbackCount, setFeedbackCount] = useState<number>(0);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  useEffect(() => {
    const loadFeedbackInfo = async () => {
      try {
        const feedback = await fetchFeedbackByTour(tour.tour_id);
        if (feedback && feedback.length > 0) {
          setFeedbackCount(feedback.length);
          const ratings = feedback.map(f => f.overall_rating || f.overview_rating).filter(r => r > 0);
          if (ratings.length > 0) {
            const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
            setAvgRating(avg);
          }
        }
      } catch (error) {
        console.error('Error loading feedback info:', error);
      }
    };

    if (tour.tour_id) {
      loadFeedbackInfo();
    }
  }, [tour.tour_id, fetchFeedbackByTour]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDuration = () => {
    const start = new Date(tour.date_start);
    const end = new Date(tour.date_end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base leading-tight pr-2">
              {tour.tour_name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs shrink-0">
                {tour.tour_code || tour.tour_id}
              </Badge>
              {feedbackCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {feedbackCount}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">
                {formatDate(tour.date_start)} - {formatDate(tour.date_end)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">{tour.passenger_count} pax</span>
            </div>
          </div>
          
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Guide:</span>
              <span className="text-xs font-medium">{tour.guide_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Driver:</span>
              <span className="text-xs font-medium">{tour.driver_name}</span>
            </div>
            {tour.tour_leader && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Tour Leader:</span>
                <span className="text-xs font-medium">{tour.tour_leader}</span>
              </div>
            )}
            {tour.truck_name && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Truck:</span>
                <span className="text-xs font-medium">{tour.truck_name}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 text-xs">
                {tour.status || 'Active'}
              </Badge>
              {avgRating && (
                <Badge variant="outline" className="text-xs">
                  {avgRating.toFixed(1)}/7
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{getDuration()}</span>
              <div className="flex items-center gap-1">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(tour);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
                {feedbackCount > 0 && onViewFeedback && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewFeedback(tour);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileTourCard;
