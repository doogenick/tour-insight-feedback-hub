
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, Users, MapPin } from 'lucide-react';
import { Tour } from '../../services/api/types';

interface MobileTourCardProps {
  tour: Tour;
  onSelect: (tour: Tour) => void;
}

const MobileTourCard: React.FC<MobileTourCardProps> = ({ tour, onSelect }) => {
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
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow active:bg-gray-50" 
      onClick={() => onSelect(tour)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base leading-tight pr-2">
              {tour.tour_name}
            </h3>
            <Badge variant="outline" className="text-xs shrink-0">
              {tour.tour_id}
            </Badge>
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
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <Badge className="bg-green-100 text-green-800 text-xs">
              Active
            </Badge>
            <span className="text-xs text-gray-500">{getDuration()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileTourCard;
