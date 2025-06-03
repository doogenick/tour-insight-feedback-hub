
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { FeedbackAnalytics } from '../../services/comprehensiveFeedbackService';

interface SatisfactionMetricsProps {
  analytics: FeedbackAnalytics;
}

const SatisfactionMetrics: React.FC<SatisfactionMetricsProps> = ({ analytics }) => {
  const satisfactionData = [
    {
      name: 'Met Expectations',
      yes: analytics.satisfactionMetrics.metExpectations.yes,
      no: analytics.satisfactionMetrics.metExpectations.no,
      percentage: analytics.satisfactionMetrics.metExpectations.percentage
    },
    {
      name: 'Value for Money',
      yes: analytics.satisfactionMetrics.valueForMoney.yes,
      no: analytics.satisfactionMetrics.valueForMoney.no,
      percentage: analytics.satisfactionMetrics.valueForMoney.percentage
    },
    {
      name: 'Would Recommend',
      yes: analytics.satisfactionMetrics.wouldRecommend.yes,
      no: analytics.satisfactionMetrics.wouldRecommend.no,
      percentage: analytics.satisfactionMetrics.wouldRecommend.percentage
    }
  ];

  const pieChartData = satisfactionData.map(item => ({
    name: item.name,
    value: item.percentage
  }));

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (percentage >= 60) return <Badge className="bg-yellow-500">Good</Badge>;
    return <Badge className="bg-red-500">Needs Improvement</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {satisfactionData.map((item, index) => (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.percentage}%</span>
                {getPerformanceBadge(item.percentage)}
              </div>
            </div>
            <Progress value={item.percentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Yes: {item.yes}</span>
              <span>No: {item.no}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, 'Satisfaction']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SatisfactionMetrics;
