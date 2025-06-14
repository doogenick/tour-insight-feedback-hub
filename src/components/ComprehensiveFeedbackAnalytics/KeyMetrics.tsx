
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Users, Star, TrendingUp, PieChart } from 'lucide-react';
import { FeedbackAnalytics } from '../../services/comprehensiveFeedbackService';

interface KeyMetricsProps {
  analytics: FeedbackAnalytics;
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalSubmissions}</div>
          <p className="text-xs text-muted-foreground">Feedback entries</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4" />
            Overall Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.averageRatings.overview.toFixed(1)}</div>
          <Progress 
            value={((7 - analytics.averageRatings.overview) / 6) * 100} 
            className="mt-2" 
          />
          <p className="text-xs text-muted-foreground">1 = Perfect, 7 = Poor</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Satisfaction Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.satisfactionMetrics.metExpectations.percentage}%</div>
          <Progress value={analytics.satisfactionMetrics.metExpectations.percentage} className="mt-2" />
          <p className="text-xs text-muted-foreground">Met expectations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Recommendation Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.satisfactionMetrics.wouldRecommend.percentage}%</div>
          <Progress value={analytics.satisfactionMetrics.wouldRecommend.percentage} className="mt-2" />
          <p className="text-xs text-muted-foreground">Would recommend</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMetrics;
