
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ComprehensiveFeedback } from '../../services/api/types';

interface RatingDistributionChartProps {
  feedback: ComprehensiveFeedback[];
}

const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({ feedback }) => {
  // Calculate rating distribution for overview ratings
  const ratingDistribution = React.useMemo(() => {
    const distribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0 };
    
    feedback.forEach(item => {
      if (item.overview_rating && item.overview_rating >= 1 && item.overview_rating <= 7) {
        distribution[item.overview_rating.toString() as keyof typeof distribution]++;
      }
    });
    
    return Object.entries(distribution).map(([rating, count]) => ({
      rating: `Rating ${rating}`,
      count,
      percentage: feedback.length > 0 ? Math.round((count / feedback.length) * 100) : 0,
      label: rating === '1' ? 'Perfect' : 
             rating === '2' ? 'Excellent' :
             rating === '3' ? 'Very Good' :
             rating === '4' ? 'Good' :
             rating === '5' ? 'Average' :
             rating === '6' ? 'Poor' : 'Unacceptable'
    }));
  }, [feedback]);

  if (feedback.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No feedback data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={ratingDistribution}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="rating" 
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis />
        <Tooltip 
          formatter={(value: number, name: string) => [
            `${value} responses (${ratingDistribution.find(d => d.count === value)?.percentage || 0}%)`,
            'Count'
          ]}
          labelFormatter={(label) => {
            const item = ratingDistribution.find(d => d.rating === label);
            return `${label} - ${item?.label || ''}`;
          }}
        />
        <Legend />
        <Bar 
          dataKey="count" 
          fill="#8884d8" 
          name="Number of Responses"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RatingDistributionChart;
