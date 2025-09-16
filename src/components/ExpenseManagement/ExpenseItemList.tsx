import React, { useState } from 'react';
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
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Eye,
  Receipt
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { expenseService } from '@/services/expenseService';
import { ExpenseItem } from '@/types/Expense';
import { useToast } from '@/components/ui/use-toast';
import EditExpenseItemDialog from './EditExpenseItemDialog';
import ExpenseItemDetailDialog from './ExpenseItemDetailDialog';

interface ExpenseItemListProps {
  expenseItems: ExpenseItem[];
  onExpenseUpdated: () => void;
  tourId?: string;
}

const ExpenseItemList: React.FC<ExpenseItemListProps> = ({
  expenseItems,
  onExpenseUpdated,
  tourId
}) => {
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [viewingItem, setViewingItem] = useState<ExpenseItem | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleApprove = async (item: ExpenseItem) => {
    setLoading(item.id);
    try {
      await expenseService.approveExpenseItem(item.id, 'current-user-id'); // TODO: Get actual user ID
      toast({
        title: "Expense Approved",
        description: `Expense "${item.description}" has been approved.`,
      });
      onExpenseUpdated();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve expense item.",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (item: ExpenseItem) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setLoading(item.id);
    try {
      await expenseService.rejectExpenseItem(item.id, 'current-user-id', reason);
      toast({
        title: "Expense Rejected",
        description: `Expense "${item.description}" has been rejected.`,
      });
      onExpenseUpdated();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject expense item.",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (item: ExpenseItem) => {
    if (!confirm('Are you sure you want to delete this expense item?')) return;

    setLoading(item.id);
    try {
      await expenseService.deleteExpenseItem(item.id);
      toast({
        title: "Expense Deleted",
        description: `Expense "${item.description}" has been deleted.`,
      });
      onExpenseUpdated();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete expense item.",
      });
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reconciled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (expenseItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Expense Items</h3>
          <p className="text-muted-foreground">
            {tourId ? 'No expenses have been recorded for this tour yet.' : 'No expense items found.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Expense Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{item.description}</p>
                      {item.location && (
                        <p className="text-sm text-muted-foreground">{item.location}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.category?.name || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(item.amount, item.currency)}
                  </TableCell>
                  <TableCell>{formatDate(item.expense_date)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={loading === item.id}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewingItem(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingItem(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {item.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(item)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(item)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDelete(item)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      {editingItem && (
        <EditExpenseItemDialog
          expenseItem={editingItem}
          onClose={() => setEditingItem(null)}
          onExpenseUpdated={onExpenseUpdated}
        />
      )}

      {viewingItem && (
        <ExpenseItemDetailDialog
          expenseItem={viewingItem}
          onClose={() => setViewingItem(null)}
        />
      )}
    </div>
  );
};

export default ExpenseItemList;
