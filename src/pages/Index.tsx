
import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Safari Feedback System</h1>
        <p className="text-lg text-muted-foreground">Manage your tour feedback and analytics</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage tours, view feedback, and access analytics
            </p>
            <Button onClick={() => navigate('/admin')} className="w-full">
              Access Admin Panel
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Feedback Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Start collecting client feedback for tours
            </p>
            <Button onClick={() => navigate('/feedback')} className="w-full">
              Start Collection
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              View comprehensive feedback analytics and insights
            </p>
            <Button onClick={() => navigate('/analytics')} variant="outline" className="w-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Expense Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage tour expenses, budgets, and reconciliations
            </p>
            <Button onClick={() => navigate('/expenses')} variant="outline" className="w-full">
              Manage Expenses
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
