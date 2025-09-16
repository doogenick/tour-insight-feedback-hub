import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  MoreHorizontal, 
  CheckCircle, 
  XCircle,
  Eye,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { expenseService } from '@/services/expenseService';
import { ExpenseReconciliation } from '@/types/Expense';
import { useToast } from '@/components/ui/use-toast';
import ExpenseReconciliationDetailDialog from './ExpenseReconciliationDetailDialog';

interface ExpenseReconciliationListProps {
  reconciliations: ExpenseReconciliation[];
  onReconciliationUpdated: () => void;
}

const ExpenseReconciliationList: React.FC<ExpenseReconciliationListProps> = ({
  reconciliations,
  onReconciliationUpdated
}) => {
  const [viewingReconciliation, setViewingReconciliation] = React.useState<ExpenseReconciliation | null>(null);
  const [loading, setLoading] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleApprove = async (reconciliation: ExpenseReconciliation) => {
    setLoading(reconciliation.id);
    try {
      await expenseService.updateExpenseReconciliation(
        reconciliation.id, 
        'approved',
        'Reconciliation approved by office staff'
      );
      toast({
        title: "Reconciliation Approved",
        description: `Reconciliation for tour ${reconciliation.tour?.tour_code} has been approved.`,
      });
      onReconciliationUpdated();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve reconciliation.",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (reconciliation: ExpenseReconciliation) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setLoading(reconciliation.id);
    try {
      await expenseService.updateExpenseReconciliation(
        reconciliation.id, 
        'rejected',
        reason
      );
      toast({
        title: "Reconciliation Rejected",
        description: `Reconciliation for tour ${reconciliation.tour?.tour_code} has been rejected.`,
      });
      onReconciliationUpdated();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject reconciliation.",
      });
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (reconciliations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Reconciliations</h3>
          <p className="text-muted-foreground">
            No expense reconciliations have been created yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Expense Reconciliations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tour</TableHead>
                <TableHead>Tour Leader</TableHead>
                <TableHead>Budgeted</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reconciliations.map((reconciliation) => (
                <TableRow key={reconciliation.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{reconciliation.tour?.tour_code || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">
                        {reconciliation.tour?.tour_name || 'Unknown Tour'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {reconciliation.tour_leader?.full_name || 'Unknown'}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(reconciliation.total_budgeted)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(reconciliation.total_actual)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        reconciliation.total_variance >= 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(Math.abs(reconciliation.total_variance))}
                      </span>
                      {reconciliation.total_variance >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(reconciliation.status)}>
                      {reconciliation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={loading === reconciliation.id}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewingReconciliation(reconciliation)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {reconciliation.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(reconciliation)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(reconciliation)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reconciliation Detail Dialog */}
      {viewingReconciliation && (
        <ExpenseReconciliationDetailDialog
          reconciliation={viewingReconciliation}
          onClose={() => setViewingReconciliation(null)}
        />
      )}
    </div>
  );
};

export default ExpenseReconciliationList;
