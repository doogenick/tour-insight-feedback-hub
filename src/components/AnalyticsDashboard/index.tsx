
import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BarChart4, Filter, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import ActionableInsights from './ActionableInsights';
import PerformanceMetrics from './PerformanceMetrics';
import InsightsDashboard from './InsightsDashboard';

const AnalyticsDashboard: React.FC = () => {
  const { 
    feedback, 
    fetchFeedback, 
    isLoading, 
    tours,
    fetchTours,
    currentUser,
    demoDataGenerated,
    generateDemoData
  } = useAppContext();
  
  const [selectedTourId, setSelectedTourId] = React.useState<string>('all');
  
  // Generate summary statistics
  const getSummaryStats = () => {
    if (feedback.length === 0) return {
      totalFeedback: 0,
      avgOverallRating: 0,
      avgGuideRating: 0,
      avgDriverRating: 0,
      avgFoodRating: 0,
      avgEquipmentRating: 0
    };
    
    let totalOverall = 0;
    let totalGuide = 0;
    let totalDriver = 0;
    let totalFood = 0;
    let countFood = 0;
    let totalEquipment = 0;
    let countEquipment = 0;
    
    feedback.forEach(item => {
      totalOverall += item.rating_overall;
      totalGuide += item.rating_guide;
      totalDriver += item.rating_driver;
      
      if (item.rating_food) {
        totalFood += item.rating_food;
        countFood++;
      }
      
      if (item.rating_equipment) {
        totalEquipment += item.rating_equipment;
        countEquipment++;
      }
    });
    
    return {
      totalFeedback: feedback.length,
      avgOverallRating: +(totalOverall / feedback.length).toFixed(2),
      avgGuideRating: +(totalGuide / feedback.length).toFixed(2),
      avgDriverRating: +(totalDriver / feedback.length).toFixed(2),
      avgFoodRating: countFood > 0 ? +(totalFood / countFood).toFixed(2) : 0,
      avgEquipmentRating: countEquipment > 0 ? +(totalEquipment / countEquipment).toFixed(2) : 0
    };
  };
  
  const stats = getSummaryStats();
  
  // Fetch feedback and tours on component mount
  useEffect(() => {
    if (feedback.length === 0) {
      if (selectedTourId === 'all') {
        fetchFeedback();
      } else {
        fetchFeedback(selectedTourId);
      }
    }
    
    if (tours.length === 0) {
      fetchTours();
    }
    
    // Generate demo data if none exists
    if (!demoDataGenerated && feedback.length === 0 && tours.length === 0) {
      generateDemoData();
    }
  }, [fetchFeedback, fetchTours, feedback.length, tours.length, selectedTourId, demoDataGenerated, generateDemoData]);
  
  // Handle tour filter change
  const handleTourChange = (tourId: string) => {
    setSelectedTourId(tourId);
    if (tourId === 'all') {
      fetchFeedback();
    } else {
      fetchFeedback(tourId);
    }
  };
  
  if (!currentUser) {
    return (
      <div className="py-8 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-xl font-medium">Login Required</h3>
        <p className="mt-2 text-muted-foreground">
          Please log in to view analytics data and insights.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="flex items-end justify-between pb-4 border-b">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <BarChart4 className="h-5 w-5" />
          <span>Performance Dashboard</span>
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <Label htmlFor="tour-filter" className="text-sm">Filter by Tour</Label>
            <Select value={selectedTourId} onValueChange={handleTourChange}>
              <SelectTrigger id="tour-filter" className="w-[200px]">
                <SelectValue placeholder="Select Tour" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tours</SelectItem>
                {tours.map(tour => (
                  <SelectItem key={tour.tour_id} value={tour.tour_id}>
                    {tour.tour_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Filter className="h-4 w-4 mr-1" />
            <span>
              {selectedTourId === 'all' 
                ? 'Showing all feedback' 
                : `Filtered to ${tours.find(t => t.tour_id === selectedTourId)?.tour_name}`}
            </span>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.totalFeedback}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {feedback.length > 0 ? [...new Set(feedback.map(f => f.client_id))].length : 0} unique clients
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.avgOverallRating}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average (1 = perfect, 7 = very poor)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Guide Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.avgGuideRating}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average (1 = perfect, 7 = very poor)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Driver Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.avgDriverRating}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average (1 = perfect, 7 = very poor)
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Enhanced Tabs for Different Analytics */}
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
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Detailed Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              {feedback.length > 0 ? (
                <div className="space-y-6 pt-4">
                  {feedback.map((item, index) => (
                    <div key={item.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex flex-wrap justify-between mb-2">
                        <div>
                          <h4 className="font-medium">
                            Feedback #{index + 1}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(item.submitted_at || '').toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Tour: {item.tour_id}</p>
                          <p className="text-sm text-muted-foreground">
                            Status: {item.status}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Overall</p>
                          <p className="font-medium">{item.rating_overall}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Guide</p>
                          <p className="font-medium">{item.rating_guide}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Driver</p>
                          <p className="font-medium">{item.rating_driver}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Food</p>
                          <p className="font-medium">{item.rating_food || 'N/A'}</p>
                        </div>
                      </div>
                      
                      {item.comments && (
                        <div className="mt-3 bg-muted/30 p-3 rounded-md">
                          <p className="text-sm italic">"{item.comments}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p>No feedback data available.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isLoading ? 'Loading...' : 'Try selecting a different tour or generating demo data.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
