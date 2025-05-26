
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Users, Calendar } from 'lucide-react';
import { Feedback } from '../../services/api';

interface InsightsDashboardProps {
  feedback: Feedback[];
  isLoading: boolean;
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ feedback, isLoading }) => {
  // Calculate comprehensive metrics
  const calculateMetrics = () => {
    if (feedback.length === 0) return null;

    const totalFeedback = feedback.length;
    const excellentRatings = feedback.filter(f => f.rating_overall <= 2).length;
    const poorRatings = feedback.filter(f => f.rating_overall >= 6).length;
    
    // Calculate satisfaction rate (ratings 1-3 considered satisfied)
    const satisfactionRate = ((feedback.filter(f => f.rating_overall <= 3).length / totalFeedback) * 100);
    
    // Calculate Net Promoter Score approximation (1-2 = promoters, 6-7 = detractors)
    const promoters = feedback.filter(f => f.rating_overall <= 2).length;
    const detractors = feedback.filter(f => f.rating_overall >= 6).length;
    const nps = ((promoters - detractors) / totalFeedback) * 100;
    
    // Category performance
    const categoryScores = {
      guide: feedback.reduce((sum, f) => sum + f.rating_guide, 0) / totalFeedback,
      driver: feedback.reduce((sum, f) => sum + f.rating_driver, 0) / totalFeedback,
      food: feedback.filter(f => f.rating_food).length > 0 
        ? feedback.filter(f => f.rating_food).reduce((sum, f) => sum + (f.rating_food || 0), 0) / feedback.filter(f => f.rating_food).length
        : 0,
      equipment: feedback.filter(f => f.rating_equipment).length > 0
        ? feedback.filter(f => f.rating_equipment).reduce((sum, f) => sum + (f.rating_equipment || 0), 0) / feedback.filter(f => f.rating_equipment).length
        : 0
    };
    
    // Response rate by tour (assuming we have tour data)
    const tourFeedback = feedback.reduce((acc, f) => {
      acc[f.tour_id] = (acc[f.tour_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Recent trends (last 7 days vs previous period)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const recentFeedback = feedback.filter(f => 
      f.submitted_at && new Date(f.submitted_at) >= sevenDaysAgo
    );
    const previousFeedback = feedback.filter(f => 
      f.submitted_at && 
      new Date(f.submitted_at) >= fourteenDaysAgo && 
      new Date(f.submitted_at) < sevenDaysAgo
    );
    
    const recentAvg = recentFeedback.length > 0 
      ? recentFeedback.reduce((sum, f) => sum + f.rating_overall, 0) / recentFeedback.length
      : 0;
    const previousAvg = previousFeedback.length > 0
      ? previousFeedback.reduce((sum, f) => sum + f.rating_overall, 0) / previousFeedback.length
      : 0;
    
    const trend = recentAvg < previousAvg ? 'improving' : recentAvg > previousAvg ? 'declining' : 'stable';
    
    return {
      totalFeedback,
      excellentRatings,
      poorRatings,
      satisfactionRate,
      nps,
      categoryScores,
      tourFeedback,
      trend,
      recentAvg,
      previousAvg,
      recentFeedback: recentFeedback.length,
      previousFeedback: previousFeedback.length
    };
  };

  const metrics = calculateMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No feedback data available for insights.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.satisfactionRate.toFixed(1)}%</div>
            <Progress value={metrics.satisfactionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalFeedback - metrics.poorRatings} of {metrics.totalFeedback} satisfied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Net Promoter Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.nps.toFixed(0)}</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant={metrics.nps >= 50 ? "default" : metrics.nps >= 0 ? "secondary" : "destructive"}>
                {metrics.nps >= 50 ? "Excellent" : metrics.nps >= 0 ? "Good" : "Poor"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Industry benchmark: 30-50
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {metrics.trend === 'improving' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : metrics.trend === 'declining' ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              )}
              Recent Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.recentAvg.toFixed(1)}</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant={
                metrics.trend === 'improving' ? "default" : 
                metrics.trend === 'declining' ? "destructive" : "secondary"
              }>
                {metrics.trend.charAt(0).toUpperCase() + metrics.trend.slice(1)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 7 days vs previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Response Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.recentFeedback}</div>
            <p className="text-sm text-muted-foreground">
              Recent responses
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              vs {metrics.previousFeedback} previous period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.categoryScores).map(([category, score]) => {
              if (score === 0) return null;
              
              const performance = score <= 2.5 ? 'excellent' : score <= 4 ? 'good' : 'needs-improvement';
              const progressValue = ((7 - score) / 6) * 100; // Convert 1-7 scale to 0-100%
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{score.toFixed(1)}</span>
                      <Badge variant={
                        performance === 'excellent' ? "default" :
                        performance === 'good' ? "secondary" : "destructive"
                      }>
                        {performance === 'excellent' ? 'Excellent' :
                         performance === 'good' ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tour Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback by Tour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(metrics.tourFeedback).map(([tourId, count]) => (
              <div key={tourId} className="flex justify-between items-center">
                <span className="font-medium">Tour {tourId}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{count} responses</span>
                  <Progress 
                    value={(count / Math.max(...Object.values(metrics.tourFeedback))) * 100} 
                    className="w-20 h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Issues Alert */}
      {metrics.poorRatings > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Critical Issues Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              {metrics.poorRatings} feedback submission(s) with ratings of 6 or 7 require immediate attention.
            </p>
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium text-red-700">Recommended Actions:</p>
              <ul className="text-sm text-red-600 space-y-1 ml-4">
                <li>• Contact affected customers directly</li>
                <li>• Review service delivery for the problematic areas</li>
                <li>• Implement corrective measures immediately</li>
                <li>• Follow up with customers after resolution</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InsightsDashboard;
