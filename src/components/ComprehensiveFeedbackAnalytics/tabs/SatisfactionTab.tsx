
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';

interface SatisfactionChartDataItem {
  name: string;
  value: number;
}

interface SatisfactionTabProps {
  data: SatisfactionChartDataItem[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const SatisfactionTab: React.FC<SatisfactionTabProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Satisfaction Percentages</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default SatisfactionTab;
