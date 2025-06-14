
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RatingChartDataItem {
  category: string;
  rating: number;
}

interface RatingsTabProps {
  data: RatingChartDataItem[];
}

const RatingsTab: React.FC<RatingsTabProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Average Ratings by Category</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
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
);

export default RatingsTab;
