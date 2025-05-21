
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ExternalLink, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { Feedback } from '../../services/api';

interface ActionableInsightsProps {
  feedback: Feedback[];
  isLoading: boolean;
}

const ActionableInsights: React.FC<ActionableInsightsProps> = ({ feedback, isLoading }) => {
  // Function to find actionable insights based on feedback
  const generateInsights = (feedbackList: Feedback[]) => {
    const insights = [];
    
    // Check for low guide ratings
    const lowGuideRatings = feedbackList.filter(item => item.rating_guide > 5);
    if (lowGuideRatings.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Guide Training Opportunity',
        description: `${lowGuideRatings.length} client(s) rated their guides below average.`,
        action: 'Schedule guide refresher training',
        priority: 'high'
      });
    }
    
    // Check for low driver ratings
    const lowDriverRatings = feedbackList.filter(item => item.rating_driver > 5);
    if (lowDriverRatings.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Driver Performance Issues',
        description: `${lowDriverRatings.length} client(s) rated their drivers below average.`,
        action: 'Review driver protocols and safety measures',
        priority: 'high'
      });
    }
    
    // Check for food quality issues
    const foodIssues = feedbackList.filter(
      item => item.rating_food !== undefined && item.rating_food > 4
    );
    if (foodIssues.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Food Quality Concerns',
        description: `${foodIssues.length} client(s) reported issues with food quality.`,
        action: 'Review catering providers and menu options',
        priority: 'medium'
      });
    }
    
    // Check for equipment issues
    const equipmentIssues = feedbackList.filter(
      item => item.rating_equipment !== undefined && item.rating_equipment > 4
    );
    if (equipmentIssues.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Equipment Improvement Needed',
        description: `${equipmentIssues.length} client(s) mentioned issues with equipment.`,
        action: 'Audit and update tour equipment',
        priority: 'medium'
      });
    }
    
    // Check for positive feedback to highlight
    const excellentFeedback = feedbackList.filter(item => 
      item.rating_overall < 3 && 
      item.rating_guide < 3 && 
      item.rating_driver < 3
    );
    if (excellentFeedback.length > 0) {
      insights.push({
        type: 'success',
        title: 'Exceptional Service Noted',
        description: `${excellentFeedback.length} client(s) gave excellent ratings across all categories.`,
        action: 'Recognize team members for outstanding service',
        priority: 'medium'
      });
    }
    
    return insights;
  };
  
  const insights = generateInsights(feedback);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actionable Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">Loading insights...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Actionable Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
            <p>No actionable insights available at this time.</p>
            <p className="text-sm text-muted-foreground mt-1">
              All feedback metrics are currently within acceptable ranges.
            </p>
          </div>
        ) : (
          insights.map((insight, index) => (
            <Alert key={index} className={
              insight.type === 'warning' 
                ? 'border-amber-500/50 bg-amber-500/10' 
                : 'border-green-500/50 bg-green-500/10'
            }>
              <div className="flex items-center justify-between">
                <div>
                  <AlertTitle className="flex items-center gap-2">
                    {insight.title}
                    <Badge variant={insight.priority === 'high' ? 'destructive' : 'outline'}>
                      {insight.priority.toUpperCase()}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription className="mt-1">{insight.description}</AlertDescription>
                </div>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <span>Action</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                <strong>Recommended Action:</strong> {insight.action}
              </div>
            </Alert>
          ))
        )}
        
        <div className="pt-4 flex justify-end">
          <Button variant="link" className="flex items-center gap-1 text-sm">
            <span>View detailed analysis</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionableInsights;
