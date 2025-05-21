
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../contexts/AppContext';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/table";
import { Feedback, Tour } from '../services/api';
import { Badge } from './ui/badge';
import { Filter, Calendar, Info } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const { feedback, tours, currentUser } = useAppContext();
  
  // Filter feedback based on user role
  const filteredFeedback = useMemo(() => {
    if (!currentUser) return feedback;
    
    if (currentUser.role === 'admin') {
      return feedback;
    } else if (currentUser.role === 'guide') {
      return feedback.filter(f => f.guide_name === currentUser.name);
    } else if (currentUser.role === 'driver') {
      return feedback.filter(f => f.driver_name === currentUser.name);
    }
    
    return [];
  }, [feedback, currentUser]);
  
  // Calculate average ratings
  const averageRatings = useMemo(() => {
    if (!filteredFeedback.length) return { overall: 0, guide: 0, driver: 0, food: 0, equipment: 0 };
    
    const sum = filteredFeedback.reduce((acc, item) => {
      return {
        overall: acc.overall + item.rating_overall,
        guide: acc.guide + item.rating_guide,
        driver: acc.driver + item.rating_driver,
        food: acc.food + (item.rating_food || 0),
        equipment: acc.equipment + (item.rating_equipment || 0),
        foodCount: acc.foodCount + (item.rating_food ? 1 : 0),
        equipmentCount: acc.equipmentCount + (item.rating_equipment ? 1 : 0),
      };
    }, { 
      overall: 0, 
      guide: 0, 
      driver: 0, 
      food: 0, 
      equipment: 0, 
      foodCount: 0,
      equipmentCount: 0
    });
    
    return {
      overall: sum.overall / filteredFeedback.length,
      guide: sum.guide / filteredFeedback.length,
      driver: sum.driver / filteredFeedback.length,
      food: sum.foodCount > 0 ? sum.food / sum.foodCount : 0,
      equipment: sum.equipmentCount > 0 ? sum.equipment / sum.equipmentCount : 0,
    };
  }, [filteredFeedback]);
  
  // Prepare data for rating distribution chart
  const ratingDistribution = useMemo(() => {
    const counts = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    
    filteredFeedback.forEach(item => {
      counts[item.rating_overall.toString()]++;
    });
    
    return Object.keys(counts).map(rating => ({
      rating,
      count: counts[rating as keyof typeof counts]
    }));
  }, [filteredFeedback]);
  
  // Prepare data for guide performance chart
  const guidePerformance = useMemo(() => {
    const guideData: Record<string, { count: number, sum: number }> = {};
    
    filteredFeedback.forEach(item => {
      if (!guideData[item.guide_name]) {
        guideData[item.guide_name] = { count: 0, sum: 0 };
      }
      
      guideData[item.guide_name].count++;
      guideData[item.guide_name].sum += item.rating_guide;
    });
    
    return Object.keys(guideData).map(name => ({
      name,
      rating: guideData[name].sum / guideData[name].count
    }));
  }, [filteredFeedback]);
  
  // Identify areas for improvement
  const areasForImprovement = useMemo(() => {
    const areas: { category: string; rating: number; priority: 'high' | 'medium' | 'low' }[] = [];
    
    if (averageRatings.food < 3.5 && averageRatings.food > 0) {
      areas.push({ 
        category: 'Food Quality',
        rating: averageRatings.food,
        priority: averageRatings.food < 3 ? 'high' : 'medium'
      });
    }
    
    if (averageRatings.equipment < 3.5 && averageRatings.equipment > 0) {
      areas.push({ 
        category: 'Equipment',
        rating: averageRatings.equipment,
        priority: averageRatings.equipment < 3 ? 'high' : 'medium'
      });
    }
    
    if (averageRatings.guide < 4) {
      areas.push({ 
        category: 'Guide Service',
        rating: averageRatings.guide,
        priority: averageRatings.guide < 3.5 ? 'high' : 'low'
      });
    }
    
    if (averageRatings.driver < 4) {
      areas.push({ 
        category: 'Driver Service',
        rating: averageRatings.driver,
        priority: averageRatings.driver < 3.5 ? 'high' : 'low'
      });
    }
    
    return areas;
  }, [averageRatings]);
  
  // Get tour data by ID
  const getTourById = (tourId: string): Tour | undefined => {
    return tours.find(tour => tour.tour_id === tourId);
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get color for priority badge
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Feedback Analytics Dashboard
          </CardTitle>
          <CardDescription>
            View insights and analytics from customer feedback
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="historical">Historical Data</TabsTrigger>
              <TabsTrigger value="improvement">Areas for Improvement</TabsTrigger>
            </TabsList>
            
            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-6">
              {/* Rating Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Overall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{averageRatings.overall.toFixed(1)}</p>
                    <p className="text-muted-foreground text-sm">Average Rating</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{averageRatings.guide.toFixed(1)}</p>
                    <p className="text-muted-foreground text-sm">Average Rating</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Driver</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{averageRatings.driver.toFixed(1)}</p>
                    <p className="text-muted-foreground text-sm">Average Rating</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Food</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {averageRatings.food > 0 ? averageRatings.food.toFixed(1) : 'N/A'}
                    </p>
                    <p className="text-muted-foreground text-sm">Average Rating</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Equipment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {averageRatings.equipment > 0 ? averageRatings.equipment.toFixed(1) : 'N/A'}
                    </p>
                    <p className="text-muted-foreground text-sm">Average Rating</p>
                  </CardContent>
                </Card>
              </div>
              
              <Separator />
              
              {/* Rating Distribution Chart */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Rating Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ratingDistribution}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Number of Ratings" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guide Performance Chart */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Guide Performance</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={guidePerformance}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 5]} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="rating" fill="#82ca9d" name="Average Rating" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Category Distribution Chart */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Rating by Category</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Overall', value: averageRatings.overall },
                            { name: 'Guide', value: averageRatings.guide },
                            { name: 'Driver', value: averageRatings.driver },
                            { name: 'Food', value: averageRatings.food > 0 ? averageRatings.food : 0 },
                            { name: 'Equipment', value: averageRatings.equipment > 0 ? averageRatings.equipment : 0 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={(entry) => entry.name}
                        >
                          {[
                            { name: 'Overall', value: averageRatings.overall },
                            { name: 'Guide', value: averageRatings.guide },
                            { name: 'Driver', value: averageRatings.driver },
                            { name: 'Food', value: averageRatings.food > 0 ? averageRatings.food : 0 },
                            { name: 'Equipment', value: averageRatings.equipment > 0 ? averageRatings.equipment : 0 },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground pt-2">
                <p>Based on {filteredFeedback.length} feedback submissions</p>
              </div>
            </TabsContent>
            
            {/* Historical Data Tab */}
            <TabsContent value="historical" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Feedback History</h3>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Showing {filteredFeedback.length} results</span>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tour ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Guide</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Overall</TableHead>
                      <TableHead>Guide</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedback.length > 0 ? (
                      filteredFeedback.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.tour_id}</TableCell>
                          <TableCell>{formatDate(item.submitted_at)}</TableCell>
                          <TableCell>{item.guide_name}</TableCell>
                          <TableCell>{item.driver_name}</TableCell>
                          <TableCell>{item.rating_overall}</TableCell>
                          <TableCell>{item.rating_guide}</TableCell>
                          <TableCell>{item.rating_driver}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {item.comments || "No comments"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No feedback data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {filteredFeedback.length > 0 
                    ? `Data ranges from ${formatDate(
                        filteredFeedback.reduce((earliest, feedback) => {
                          if (!earliest || !feedback.submitted_at) return earliest;
                          return new Date(feedback.submitted_at) < new Date(earliest) 
                            ? feedback.submitted_at 
                            : earliest;
                        }, filteredFeedback[0]?.submitted_at)
                      )} to ${formatDate(
                        filteredFeedback.reduce((latest, feedback) => {
                          if (!latest || !feedback.submitted_at) return latest;
                          return new Date(feedback.submitted_at) > new Date(latest) 
                            ? feedback.submitted_at 
                            : latest;
                        }, filteredFeedback[0]?.submitted_at)
                      )}`
                    : 'No data available'
                  }
                </span>
              </div>
            </TabsContent>
            
            {/* Areas for Improvement Tab */}
            <TabsContent value="improvement" className="space-y-6">
              <h3 className="text-lg font-medium">Areas for Improvement</h3>
              
              {areasForImprovement.length > 0 ? (
                <div className="space-y-4">
                  {areasForImprovement.map((area, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{area.category}</CardTitle>
                          <Badge className={getPriorityColor(area.priority)}>
                            {area.priority.charAt(0).toUpperCase() + area.priority.slice(1)} Priority
                          </Badge>
                        </div>
                        <CardDescription>
                          Average Rating: {area.rating.toFixed(1)} / 5
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <h4 className="font-medium">Suggested Actions:</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {area.category === 'Food Quality' && (
                              <>
                                <li>Review food suppliers and consider alternatives</li>
                                <li>Collect more specific feedback about meal preferences</li>
                                <li>Consider additional dietary options</li>
                              </>
                            )}
                            
                            {area.category === 'Equipment' && (
                              <>
                                <li>Conduct inventory check and replace worn items</li>
                                <li>Upgrade equipment based on tour requirements</li>
                                <li>Implement regular maintenance schedule</li>
                              </>
                            )}
                            
                            {area.category === 'Guide Service' && (
                              <>
                                <li>Provide additional training in customer service</li>
                                <li>Ensure guides have updated information about attractions</li>
                                <li>Review guide assignments to match expertise with tour types</li>
                              </>
                            )}
                            
                            {area.category === 'Driver Service' && (
                              <>
                                <li>Review driver safety protocols</li>
                                <li>Provide customer service refresher training</li>
                                <li>Ensure comfortable driving pace for tourists</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No significant areas for improvement identified.</p>
                    <p className="text-sm mt-2">Continue maintaining the high standards of service!</p>
                  </CardContent>
                </Card>
              )}
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Constructive Feedback</h3>
                
                <div className="space-y-3 mt-4">
                  {filteredFeedback
                    .filter(feedback => 
                      feedback.comments && 
                      feedback.comments.length > 20 && 
                      (feedback.rating_overall < 4 || 
                       feedback.rating_guide < 4 || 
                       feedback.rating_driver < 4 || 
                       (feedback.rating_food || 5) < 4 || 
                       (feedback.rating_equipment || 5) < 4)
                    )
                    .map((feedback, index) => (
                      <div key={index} className="p-3 bg-background rounded-md border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Tour: {feedback.tour_id}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(feedback.submitted_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Overall: {feedback.rating_overall}/5</p>
                            <p className="text-sm">
                              {feedback.rating_guide < 4 && `Guide: ${feedback.rating_guide}/5 `}
                              {feedback.rating_driver < 4 && `Driver: ${feedback.rating_driver}/5 `}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm italic">"{feedback.comments}"</p>
                      </div>
                    ))}
                    
                  {filteredFeedback.filter(feedback => 
                    feedback.comments && 
                    feedback.comments.length > 20 && 
                    (feedback.rating_overall < 4 || 
                     feedback.rating_guide < 4 || 
                     feedback.rating_driver < 4 || 
                     (feedback.rating_food || 5) < 4 || 
                     (feedback.rating_equipment || 5) < 4)
                  ).length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No significant constructive feedback available.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
