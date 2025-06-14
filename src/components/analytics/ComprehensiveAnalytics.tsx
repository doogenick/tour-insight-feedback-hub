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

      {/* Only show the Comprehensive Feedback Analytics */}
      <ComprehensiveFeedbackAnalytics />
    </div>
  );
};

export default ComprehensiveAnalytics;
