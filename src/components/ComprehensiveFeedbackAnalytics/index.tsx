
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Download, 
  BarChart3, 
  PieChart, 
  Users, 
  Star, 
  TrendingUp,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  LineChart,
  Line
} from 'recharts';
import { comprehensiveFeedbackService, FeedbackAnalytics } from '../../services/comprehensiveFeedbackService';
import { ComprehensiveFeedback } from '../../services/api/types';
import FilterControls from './FilterControls';
import RatingDistributionChart from './RatingDistributionChart';
import SatisfactionMetrics from './SatisfactionMetrics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

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

  // Prepare chart data
  const ratingChartData = analytics ? Object.entries(analytics.averageRatings).map(([key, value]) => ({
    category: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    rating: value,
    performance: value <= 2.5 ? 'Excellent' : value <= 4 ? 'Good' : 'Needs Improvement'
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
      information: analytics.crewPerformance.guide.information
    },
    {
      category: 'Driver',
      overall: analytics.crewPerformance.driver.averageRating,
      professionalism: analytics.crewPerformance.driver.professionalism,
      organisation: analytics.crewPerformance.driver.organisation,
      peopleSkills: analytics.crewPerformance.driver.peopleSkills,
      enthusiasm: analytics.crewPerformance.driver.enthusiasm,
      information: analytics.crewPerformance.driver.information
    }
  ] : [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No feedback data available for analytics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Comprehensive Feedback Analytics</h1>
        <div className="flex gap-2">
          <Button onClick={handleExportJSON} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <FilterControls 
        feedback={allFeedback}
        onFilterChange={setFilteredFeedback}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Key Metrics Overview */}
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
          <Card>
            <CardHeader>
              <CardTitle>Average Ratings by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ratingChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis domain={[0, 7]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rating" fill="#8884d8" name="Average Rating" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Satisfaction Percentages</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={satisfactionChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {satisfactionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crew" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crew Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={crewPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 7]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="overall" fill="#8884d8" name="Overall" />
                  <Bar dataKey="professionalism" fill="#82ca9d" name="Professionalism" />
                  <Bar dataKey="organisation" fill="#ffc658" name="Organisation" />
                  <Bar dataKey="peopleSkills" fill="#ff7300" name="People Skills" />
                  <Bar dataKey="enthusiasm" fill="#0088fe" name="Enthusiasm" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tour Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                {analytics.commonFeedback.highlights.length > 0 ? (
                  analytics.commonFeedback.highlights.map((highlight, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-sm">
                      "{highlight}"
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No highlights available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                {analytics.commonFeedback.improvements.length > 0 ? (
                  analytics.commonFeedback.improvements.map((improvement, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-sm">
                      "{improvement}"
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No suggestions available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                {analytics.commonFeedback.additionalComments.length > 0 ? (
                  analytics.commonFeedback.additionalComments.map((comment, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-sm">
                      "{comment}"
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No additional comments available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveFeedbackAnalytics;
