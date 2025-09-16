import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Receipt, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { expenseService } from '@/services/expenseService';
import { ExpenseItem, ExpenseReconciliation, ExpenseSummary } from '@/types/Expense';
import ExpenseItemList from './ExpenseItemList';
import ExpenseReconciliationList from './ExpenseReconciliationList';
import CreateExpenseItemDialog from './CreateExpenseItemDialog';
import ExpenseAnalytics from './ExpenseAnalytics';

interface ExpenseManagementDashboardProps {
  tourId?: string;
  tourName?: string;
}

const ExpenseManagementDashboard: React.FC<ExpenseManagementDashboardProps> = ({
  tourId,
  tourName
}) => {
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [reconciliations, setReconciliations] = useState<ExpenseReconciliation[]>([]);
  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses');

  useEffect(() => {
    loadData();
  }, [tourId]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tourId) {
        const [items, summary] = await Promise.all([
          expenseService.getExpenseItemsByTour(tourId),
          expenseService.getExpenseSummaryByTour(tourId)
        ]);
        setExpenseItems(items);
        setExpenseSummary(summary);
      } else {
        const [items, recons] = await Promise.all([
          expenseService.getExpenseItemsByStatus('pending'),
          expenseService.getExpenseReconciliations()
        ]);
        setExpenseItems(items);
        setReconciliations(recons);
      }
    } catch (error) {
      console.error('Error loading expense data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseItemCreated = () => {
    loadData();
  };

  const handleExpenseItemUpdated = () => {
    loadData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reconciled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      case 'reconciled': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tour-primary mx-auto mb-4"></div>
          <p>Loading expense data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {tourName ? `Expense Management - ${tourName}` : 'Expense Management'}
          </h1>
          <p className="text-muted-foreground">
            {tourId ? 'Manage expenses for this tour' : 'Overview of all tour expenses'}
          </p>
        </div>
        <CreateExpenseItemDialog 
          tourId={tourId}
          onExpenseCreated={handleExpenseItemCreated}
        />
      </div>

      {/* Summary Cards */}
      {expenseSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Budgeted</p>
                  <p className="text-2xl font-bold">${expenseSummary.total_budgeted.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Actual</p>
                  <p className="text-2xl font-bold">${expenseSummary.total_actual.toFixed(2)}</p>
                </div>
                <Receipt className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Variance</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-2xl font-bold ${
                      expenseSummary.total_variance >= 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${Math.abs(expenseSummary.total_variance).toFixed(2)}
                    </p>
                    {expenseSummary.total_variance >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Items</p>
                  <p className="text-2xl font-bold">
                    {expenseItems.filter(item => item.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="reconciliations">Reconciliations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <ExpenseItemList
            expenseItems={expenseItems}
            onExpenseUpdated={handleExpenseItemUpdated}
            tourId={tourId}
          />
        </TabsContent>

        <TabsContent value="reconciliations" className="space-y-4">
          <ExpenseReconciliationList
            reconciliations={reconciliations}
            onReconciliationUpdated={loadData}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <ExpenseAnalytics tourId={tourId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseManagementDashboard;
