
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { RefreshCw, Database } from 'lucide-react';
import { comprehensiveFeedbackService, FeedbackAnalytics } from '../../services/comprehensiveFeedbackService';
import { tourService } from '../../services/api';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';
import FilterControls from './FilterControls';
import RatingDistributionChart from './RatingDistributionChart';
import SatisfactionMetrics from './SatisfactionMetrics';
import { useToast } from '../ui/use-toast';
import AnalyticsHeader from './AnalyticsHeader';
import KeyMetrics from './KeyMetrics';
import RatingsTab from './tabs/RatingsTab';
import SatisfactionTab from './tabs/SatisfactionTab';
import CrewPerformanceTab from './tabs/CrewPerformanceTab';
import FeedbackTextTab from './tabs/FeedbackTextTab';

const ComprehensiveFeedbackAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<FeedbackAnalytics | null>(null);
  const [allFeedback, setAllFeedback] = useState<ComprehensiveFeedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<ComprehensiveFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tourSection: '',
    dateRange: '',
    nationality: '',
    ratingThreshold: 0
  });
  const [generatingDemo, setGeneratingDemo] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const feedback = await comprehensiveFeedbackService.getAllFeedback();
      const analyticsData = await comprehensiveFeedbackService.generateAnalytics();
      
      setAllFeedback(feedback);
      setFilteredFeedback(feedback);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading feedback data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportJSON = async () => {
    try {
      const blob = await comprehensiveFeedbackService.exportToJSON();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-analytics-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting JSON:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await comprehensiveFeedbackService.exportToCSV();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const handleGenerateDemoFeedback = async () => {
    setGeneratingDemo(true);
    toast({
      title: "Generating Demo Data...",
      description: "Populating comprehensive feedback. Please wait.",
    });
    try {
      const { comprehensiveFeedback } = await tourService.generateDemoData();
      toast({
        title: "Demo Data Loaded into DB",
        description: `Generated ${comprehensiveFeedback.length} new feedback entries. Analytics will now refresh.`,
      });
      await loadData(); // Refresh analytics after generation
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating demo data",
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setGeneratingDemo(false);
    }
  };

  // Prepare chart data
  const ratingChartData = analytics ? Object.entries(analytics.averageRatings).map(([key, value]) => ({
    category: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    rating: value,
  })) : [];

  const satisfactionChartData = analytics ? [
    { name: 'Met Expectations', value: analytics.satisfactionMetrics.metExpectations.percentage },
    { name: 'Value for Money', value: analytics.satisfactionMetrics.valueForMoney.percentage },
    { name: 'Would Recommend', value: analytics.satisfactionMetrics.wouldRecommend.percentage }
  ] : [];

  const crewPerformanceData = analytics ? [
    {
      category: 'Guide',
      overall: analytics.crewPerformance.guide.averageRating,
      professionalism: analytics.crewPerformance.guide.professionalism,
      organisation: analytics.crewPerformance.guide.organisation,
      peopleSkills: analytics.crewPerformance.guide.peopleSkills,
      enthusiasm: analytics.crewPerformance.guide.enthusiasm,
    },
    {
      category: 'Driver',
      overall: analytics.crewPerformance.driver.averageRating,
      professionalism: analytics.crewPerformance.driver.professionalism,
      organisation: analytics.crewPerformance.driver.organisation,
      peopleSkills: analytics.crewPerformance.driver.peopleSkills,
      enthusiasm: analytics.crewPerformance.driver.enthusiasm,
    }
  ] : [];

  if (loading || generatingDemo) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">{generatingDemo ? "Generating demo data..." : "Loading analytics..."}</span>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No feedback data available for analytics.</p>
          </CardContent>
        </Card>
        <div className="flex justify-center">
          <Button
            onClick={handleGenerateDemoFeedback}
            disabled={generatingDemo}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            {generatingDemo ? "Generating Demo Data..." : "Generate Demo Data"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AnalyticsHeader
        onExportJSON={handleExportJSON}
        onExportCSV={handleExportCSV}
        onRefresh={loadData}
        onGenerateDemo={handleGenerateDemoFeedback}
        isGeneratingDemo={generatingDemo}
      />

      <FilterControls 
        feedback={allFeedback}
        onFilterChange={setFilteredFeedback}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <KeyMetrics analytics={analytics} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="crew">Crew Performance</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <RatingDistributionChart feedback={filteredFeedback} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <SatisfactionMetrics analytics={analytics} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <RatingsTab data={ratingChartData} />
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-4">
          <SatisfactionTab data={satisfactionChartData} />
        </TabsContent>

        <TabsContent value="crew" className="space-y-4">
          <CrewPerformanceTab data={crewPerformanceData} />
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <FeedbackTextTab commonFeedback={analytics.commonFeedback} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveFeedbackAnalytics;
