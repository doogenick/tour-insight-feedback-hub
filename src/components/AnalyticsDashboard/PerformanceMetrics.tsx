
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Feedback } from '../../services/api';

interface PerformanceMetricsProps {
  feedback: Feedback[];
  isLoading: boolean;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ feedback, isLoading }) => {
  // Process feedback to get guide and driver performance
  const processPerformanceData = (feedbackList: Feedback[]) => {
    // Group by guides and drivers and calculate average ratings
    const guideMap = new Map();
    const driverMap = new Map();
    
    feedbackList.forEach(item => {
      // Process guide data
      if (!guideMap.has(item.guide_name)) {
        guideMap.set(item.guide_name, {
          name: item.guide_name,
          totalRating: item.rating_guide,
          count: 1
        });
      } else {
        const guideData = guideMap.get(item.guide_name);
        guideMap.set(item.guide_name, {
          ...guideData,
          totalRating: guideData.totalRating + item.rating_guide,
          count: guideData.count + 1
        });
      }
      
      // Process driver data
      if (!driverMap.has(item.driver_name)) {
        driverMap.set(item.driver_name, {
          name: item.driver_name,
          totalRating: item.rating_driver,
          count: 1
        });
      } else {
        const driverData = driverMap.get(item.driver_name);
        driverMap.set(item.driver_name, {
          ...driverData,
          totalRating: driverData.totalRating + item.rating_driver,
          count: driverData.count + 1
        });
      }
    });
    
    // Calculate averages
    const guideData = Array.from(guideMap.values()).map(guide => ({
      name: guide.name,
      averageRating: Number((guide.totalRating / guide.count).toFixed(2)),
      feedbackCount: guide.count
    }));
    
    const driverData = Array.from(driverMap.values()).map(driver => ({
      name: driver.name,
      averageRating: Number((driver.totalRating / driver.count).toFixed(2)),
      feedbackCount: driver.count
    }));
    
    // Sort by average rating (remember lower is better in this scale)
    guideData.sort((a, b) => a.averageRating - b.averageRating);
    driverData.sort((a, b) => a.averageRating - b.averageRating);
    
    return { guideData, driverData };
  };
  
  const { guideData, driverData } = processPerformanceData(feedback);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <p className="text-center py-4">Loading performance data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (guideData.length === 0 && driverData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <div className="h-full flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              No performance data available. Submit feedback to view metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {guideData.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Guide Ratings</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={guideData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 7]} allowDecimals={false} />
                <Tooltip 
                  formatter={(value: number) => [`${value} (Lower is better)`, 'Rating']}
                  labelFormatter={(value) => `Guide: ${value}`}
                />
                <Legend />
                <Bar name="Average Rating" dataKey="averageRating" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Ratings scale: 1 = Perfect, 7 = Very Poor
            </p>
          </div>
        )}
        
        {driverData.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Driver Ratings</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={driverData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 7]} allowDecimals={false} />
                <Tooltip
                  formatter={(value: number) => [`${value} (Lower is better)`, 'Rating']}
                  labelFormatter={(value) => `Driver: ${value}`}
                />
                <Legend />
                <Bar name="Average Rating" dataKey="averageRating" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Ratings scale: 1 = Perfect, 7 = Very Poor
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
