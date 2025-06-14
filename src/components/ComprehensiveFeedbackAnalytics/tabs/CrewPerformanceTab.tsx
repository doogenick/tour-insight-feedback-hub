
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CrewPerformanceDataItem {
  category: string;
  overall: number;
  professionalism: number;
  organisation: number;
  peopleSkills: number;
  enthusiasm: number;
}

interface CrewPerformanceTabProps {
  data: CrewPerformanceDataItem[];
}

const CrewPerformanceTab: React.FC<CrewPerformanceTabProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Crew Performance Comparison</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
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
);

export default CrewPerformanceTab;
