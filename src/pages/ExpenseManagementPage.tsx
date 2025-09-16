import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExpenseManagementDashboard from '@/components/ExpenseManagement/ExpenseManagementDashboard';

const ExpenseManagementPage: React.FC = () => {
  const { tourId } = useParams<{ tourId?: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                Expense Management
              </h1>
              <p className="text-muted-foreground">
                Manage tour expenses, budgets, and reconciliations
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ExpenseManagementDashboard 
          tourId={tourId}
          tourName={tourId ? `Tour ${tourId}` : undefined}
        />
      </div>
    </div>
  );
};

export default ExpenseManagementPage;
