
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users } from 'lucide-react';
import { Feedback } from '../../services/api';

interface SummaryCardsProps {
  feedback: Feedback[];
  isLoading: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ feedback, isLoading }) => {
  // Generate summary statistics
  const getSummaryStats = () => {
    if (feedback.length === 0) return {
      totalFeedback: 0,
      avgOverallRating: 0,
      avgGuideRating: 0,
      avgDriverRating: 0,
      avgFoodRating: 0,
      avgEquipmentRating: 0
    };
    
    let totalOverall = 0;
    let totalGuide = 0;
    let totalDriver = 0;
    let totalFood = 0;
    let countFood = 0;
    let totalEquipment = 0;
    let countEquipment = 0;
    
    feedback.forEach(item => {
      totalOverall += item.rating_overall;
      totalGuide += item.rating_guide;
      totalDriver += item.rating_driver;
      
      if (item.rating_food) {
        totalFood += item.rating_food;
        countFood++;
      }
      
      if (item.rating_equipment) {
        totalEquipment += item.rating_equipment;
        countEquipment++;
      }
    });
    
    return {
      totalFeedback: feedback.length,
      avgOverallRating: +(totalOverall / feedback.length).toFixed(2),
      avgGuideRating: +(totalGuide / feedback.length).toFixed(2),
      avgDriverRating: +(totalDriver / feedback.length).toFixed(2),
      avgFoodRating: countFood > 0 ? +(totalFood / countFood).toFixed(2) : 0,
      avgEquipmentRating: countEquipment > 0 ? +(totalEquipment / countEquipment).toFixed(2) : 0
    };
  };
  
  const stats = getSummaryStats();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : stats.totalFeedback}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            From {feedback.length > 0 ? [...new Set(feedback.map(f => f.client_id))].length : 0} unique clients
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Overall Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : stats.avgOverallRating}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Average (1 = perfect, 7 = very poor)
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Guide Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : stats.avgGuideRating}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Average (1 = perfect, 7 = very poor)
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Driver Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : stats.avgDriverRating}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Average (1 = perfect, 7 = very poor)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
