import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, List, User, TrendingUp } from 'lucide-react';
import UnifiedFeedbackViewer from '@/components/UnifiedFeedbackViewer';

const FeedbackManagementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'overview';
  const tourId = searchParams.get('tourId') || undefined;
  const feedbackId = searchParams.get('feedbackId') || undefined;

  const getInitialView = () => {
    if (feedbackId) return 'individual';
    if (tourId) return 'tour-list';
    return 'overview';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Feedback Management</h1>
        <p className="text-muted-foreground">
          View and manage client feedback across all tours
        </p>
      </div>

      <Tabs defaultValue={view} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tours" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            By Tour
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Individual
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <UnifiedFeedbackViewer 
            initialView="overview"
            showAnalytics={false}
          />
        </TabsContent>

        <TabsContent value="tours">
          <UnifiedFeedbackViewer 
            initialView="tour-list"
            initialTourId={tourId}
            showAnalytics={false}
          />
        </TabsContent>

        <TabsContent value="individual">
          <UnifiedFeedbackViewer 
            initialView="individual"
            initialFeedbackId={feedbackId}
            showAnalytics={false}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <UnifiedFeedbackViewer 
            initialView="analytics"
            showAnalytics={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackManagementPage;
