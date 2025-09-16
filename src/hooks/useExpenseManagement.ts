import { useState, useCallback } from 'react';
import { expenseService } from '@/services/expenseService';
import { useToast } from '@/components/ui/use-toast';
import { 
  ExpenseItem, 
  ExpenseReconciliation, 
  ExpenseSummary,
  CreateExpenseItemData,
  CreateExpenseBudgetData,
  UpdateExpenseItemData
} from '@/types/Expense';

export function useExpenseManagement() {
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [reconciliations, setReconciliations] = useState<ExpenseReconciliation[]>([]);
  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load expense items for a specific tour
  const loadExpenseItems = useCallback(async (tourId: string) => {
    setIsLoading(true);
    try {
      const items = await expenseService.getExpenseItemsByTour(tourId);
      setExpenseItems(items);
    } catch (error) {
      console.error('Error loading expense items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load expense items.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load expense items by status
  const loadExpenseItemsByStatus = useCallback(async (status: string) => {
    setIsLoading(true);
    try {
      const items = await expenseService.getExpenseItemsByStatus(status);
      setExpenseItems(items);
    } catch (error) {
      console.error('Error loading expense items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load expense items.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load reconciliations
  const loadReconciliations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await expenseService.getExpenseReconciliations();
      setReconciliations(data);
    } catch (error) {
      console.error('Error loading reconciliations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load reconciliations.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load expense summary for a tour
  const loadExpenseSummary = useCallback(async (tourId: string) => {
    setIsLoading(true);
    try {
      const summary = await expenseService.getExpenseSummaryByTour(tourId);
      setExpenseSummary(summary);
    } catch (error) {
      console.error('Error loading expense summary:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load expense summary.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create expense item
  const createExpenseItem = useCallback(async (expenseData: CreateExpenseItemData) => {
    try {
      const newItem = await expenseService.createExpenseItem(expenseData);
      setExpenseItems(prev => [newItem, ...prev]);
      toast({
        title: "Success",
        description: "Expense item created successfully.",
      });
      return newItem;
    } catch (error) {
      console.error('Error creating expense item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create expense item.",
      });
      throw error;
    }
  }, [toast]);

  // Update expense item
  const updateExpenseItem = useCallback(async (id: string, updates: UpdateExpenseItemData) => {
    try {
      const updatedItem = await expenseService.updateExpenseItem(id, updates);
      setExpenseItems(prev => 
        prev.map(item => item.id === id ? updatedItem : item)
      );
      toast({
        title: "Success",
        description: "Expense item updated successfully.",
      });
      return updatedItem;
    } catch (error) {
      console.error('Error updating expense item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update expense item.",
      });
      throw error;
    }
  }, [toast]);

  // Delete expense item
  const deleteExpenseItem = useCallback(async (id: string) => {
    try {
      await expenseService.deleteExpenseItem(id);
      setExpenseItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Expense item deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting expense item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete expense item.",
      });
      throw error;
    }
  }, [toast]);

  // Approve expense item
  const approveExpenseItem = useCallback(async (id: string, approvedBy: string) => {
    try {
      const approvedItem = await expenseService.approveExpenseItem(id, approvedBy);
      setExpenseItems(prev => 
        prev.map(item => item.id === id ? approvedItem : item)
      );
      toast({
        title: "Success",
        description: "Expense item approved successfully.",
      });
      return approvedItem;
    } catch (error) {
      console.error('Error approving expense item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve expense item.",
      });
      throw error;
    }
  }, [toast]);

  // Reject expense item
  const rejectExpenseItem = useCallback(async (id: string, rejectedBy: string, reason?: string) => {
    try {
      const rejectedItem = await expenseService.rejectExpenseItem(id, rejectedBy, reason);
      setExpenseItems(prev => 
        prev.map(item => item.id === id ? rejectedItem : item)
      );
      toast({
        title: "Success",
        description: "Expense item rejected successfully.",
      });
      return rejectedItem;
    } catch (error) {
      console.error('Error rejecting expense item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject expense item.",
      });
      throw error;
    }
  }, [toast]);

  // Create reconciliation
  const createReconciliation = useCallback(async (tourId: string, tourLeaderId: string, officeStaffId: string) => {
    try {
      const newReconciliation = await expenseService.createExpenseReconciliation(tourId, tourLeaderId, officeStaffId);
      setReconciliations(prev => [newReconciliation, ...prev]);
      toast({
        title: "Success",
        description: "Reconciliation created successfully.",
      });
      return newReconciliation;
    } catch (error) {
      console.error('Error creating reconciliation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create reconciliation.",
      });
      throw error;
    }
  }, [toast]);

  // Update reconciliation
  const updateReconciliation = useCallback(async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const updatedReconciliation = await expenseService.updateExpenseReconciliation(id, status, notes);
      setReconciliations(prev => 
        prev.map(reconciliation => reconciliation.id === id ? updatedReconciliation : reconciliation)
      );
      toast({
        title: "Success",
        description: `Reconciliation ${status} successfully.`,
      });
      return updatedReconciliation;
    } catch (error) {
      console.error('Error updating reconciliation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update reconciliation.",
      });
      throw error;
    }
  }, [toast]);

  return {
    // State
    expenseItems,
    reconciliations,
    expenseSummary,
    isLoading,
    
    // Actions
    loadExpenseItems,
    loadExpenseItemsByStatus,
    loadReconciliations,
    loadExpenseSummary,
    createExpenseItem,
    updateExpenseItem,
    deleteExpenseItem,
    approveExpenseItem,
    rejectExpenseItem,
    createReconciliation,
    updateReconciliation,
  };
}
