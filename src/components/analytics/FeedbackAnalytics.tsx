import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { feedbackService } from '../../services/api';
import { Skeleton } from '../ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function FeedbackAnalytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const { data: feedback = [], isLoading: isLoadingFeedback, refetch: refetchFeedback } = useQuery({
    queryKey: ['feedback'],
    queryFn: () => feedbackService.getAllFeedback()
  });

  const { data: stats, isLoading: isLoadingStats, refetch: refetchStats } = useQuery({
    queryKey: ['feedback-stats'],
    queryFn: () => feedbackService.getFeedbackStats()
  });

  const { data: trendData, isLoading: isLoadingTrend } = useQuery({
    queryKey: ['feedback-trend', timeRange],
    queryFn: () => feedbackService.getFeedbackTrend(timeRange)
  });

  // Process feedback data for charts
  const processRatingData = () => {
    if (!stats?.byTour) return [];
    return Object.entries(stats.byTour).map(([tourId, data]: [string, any]) => ({
      tour_id: tourId,
      guide_avg: data.averageGuideRating,
      driver_avg: data.averageDriverRating,
      overall_avg: data.averageRating,
      feedback_count: data.count
    }));
  };

  // Prepare data for sentiment distribution
  const sentimentData = [
    { name: 'Positive', value: feedback.filter(f => f.rating_overall >= 4).length },
    { name: 'Neutral', value: feedback.filter(f => f.rating_overall === 3).length },
    { name: 'Negative', value: feedback.filter(f => f.rating_overall < 3).length },
  ];

  const handleExport = async () => {
    try {
      const blob = await feedbackService.exportFeedbackToCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting feedback:', error);
    }
  };

  const handleRefresh = () => {
    refetchFeedback();
    refetchStats();
  };

  if (isLoadingFeedback || isLoadingStats || isLoadingTrend) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feedback Analytics</h1>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={(value: 'week' | 'month' | 'year') => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalFeedback || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total feedback submissions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v4" />
              <path d="m16 4-3 5" />
              <path d="m8 4 3 5" />
              <path d="M18 10a8 8 0 1 1-12 0" />
              <path d="M12 18v-4" />
              <path d="m8 20 3-5" />
              <path d="m16 20-3-5" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}/5
            </div>
            <p className="text-xs text-muted-foreground">
              Across all feedback
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentiment</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sentimentData[0].value > 0 ? 
                `${Math.round((sentimentData[0].value / feedback.length) * 100)}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Positive feedback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Feedback Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Trend</CardTitle>
            <CardDescription>Feedback volume and average rating over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" domain={[0, 5]} />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="averageRating" 
                  stroke="#8884d8" 
                  name="Avg. Rating" 
                  activeDot={{ r: 8 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="count" 
                  stroke="#82ca9d" 
                  name="Feedback Count" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Breakdown of feedback by sentiment</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} feedback`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tour Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Performance</CardTitle>
          <CardDescription>Average ratings by tour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processRatingData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tour_id" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="guide_avg" name="Guide Rating" fill="#8884d8" />
                <Bar dataKey="driver_avg" name="Driver Rating" fill="#82ca9d" />
                <Bar dataKey="overall_avg" name="Overall Rating" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>Most recent feedback submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedback.slice(0, 5).map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Tour ID: {item.tour_id}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.comments || 'No comments provided'}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-2 text-sm">
                  <span className="inline-flex items-center">
                    <svg
                      className="h-4 w-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1">{item.rating_overall.toFixed(1)}</span>
                  </span>
                  <span>•</span>
                  <span>Guide: {item.rating_guide}/5</span>
                  <span>•</span>
                  <span>Driver: {item.rating_driver}/5</span>
                </div>
              </div>
            ))}
            {feedback.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No feedback available yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
