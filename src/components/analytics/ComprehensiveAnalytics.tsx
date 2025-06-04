
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FeedbackAnalytics } from './FeedbackAnalytics';
import ComprehensiveFeedbackAnalytics from '../ComprehensiveFeedbackAnalytics';

const ComprehensiveAnalytics: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      <Tabs defaultValue="standard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Standard Feedback</TabsTrigger>
          <TabsTrigger value="comprehensive">Comprehensive Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Standard Feedback Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <FeedbackAnalytics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comprehensive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Feedback Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ComprehensiveFeedbackAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveAnalytics;
