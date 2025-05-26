
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TrendingUp } from 'lucide-react';
import { Feedback } from '../../services/api';
import InsightsDashboard from './InsightsDashboard';
import PerformanceMetrics from './PerformanceMetrics';
import ActionableInsights from './ActionableInsights';
import DetailedFeedbackTab from './DetailedFeedbackTab';

interface TabsNavigationProps {
  feedback: Feedback[];
  isLoading: boolean;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ feedback, isLoading }) => {
  return (
    <Tabs defaultValue="insights">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="insights" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Insights
        </TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="actionable">Actions</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      
      <TabsContent value="insights">
        <InsightsDashboard feedback={feedback} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="performance">
        <PerformanceMetrics feedback={feedback} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="actionable">
        <ActionableInsights feedback={feedback} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="details">
        <DetailedFeedbackTab feedback={feedback} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsNavigation;
