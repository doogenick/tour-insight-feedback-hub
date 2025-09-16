import { supabase } from '@/integrations/supabase/client';
import { 
  ExpenseCategory, 
  ExpenseItem, 
  ExpenseBudget, 
  ExpenseReconciliation,
  ExpenseSummary,
  CreateExpenseItemData,
  CreateExpenseBudgetData,
  UpdateExpenseItemData
} from '@/types/Expense';

class ExpenseService {
  // Expense Categories
  async getExpenseCategories(): Promise<ExpenseCategory[]> {
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  // Expense Items
  async getExpenseItemsByTour(tourId: string): Promise<ExpenseItem[]> {
    const { data, error } = await supabase
      .from('expense_items')
      .select(`
        *,
        category:expense_categories(*),
        tour_leader:crew_members!expense_items_tour_leader_id_fkey(id, full_name),
        approver:crew_members!expense_items_approved_by_fkey(id, full_name)
      `)
      .eq('tour_id', tourId)
      .order('expense_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getExpenseItemsByStatus(status: string): Promise<ExpenseItem[]> {
    const { data, error } = await supabase
      .from('expense_items')
      .select(`
        *,
        category:expense_categories(*),
        tour_leader:crew_members!expense_items_tour_leader_id_fkey(id, full_name),
        approver:crew_members!expense_items_approved_by_fkey(id, full_name),
        tour:tours(tour_code, tour_name)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createExpenseItem(expenseData: CreateExpenseItemData): Promise<ExpenseItem> {
    const { data, error } = await supabase
      .from('expense_items')
      .insert(expenseData)
      .select(`
        *,
        category:expense_categories(*),
        tour_leader:crew_members!expense_items_tour_leader_id_fkey(id, full_name),
        approver:crew_members!expense_items_approved_by_fkey(id, full_name)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateExpenseItem(id: string, updates: UpdateExpenseItemData): Promise<ExpenseItem> {
    const { data, error } = await supabase
      .from('expense_items')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        category:expense_categories(*),
        tour_leader:crew_members!expense_items_tour_leader_id_fkey(id, full_name),
        approver:crew_members!expense_items_approved_by_fkey(id, full_name)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteExpenseItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('expense_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async approveExpenseItem(id: string, approvedBy: string): Promise<ExpenseItem> {
    const { data, error } = await supabase
      .from('expense_items')
      .update({
        status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        category:expense_categories(*),
        tour_leader:crew_members!expense_items_tour_leader_id_fkey(id, full_name),
        approver:crew_members!expense_items_approved_by_fkey(id, full_name)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  async rejectExpenseItem(id: string, rejectedBy: string, reason?: string): Promise<ExpenseItem> {
    const { data, error } = await supabase
      .from('expense_items')
      .update({
        status: 'rejected',
        approved_by: rejectedBy,
        approved_at: new Date().toISOString(),
        notes: reason ? `${reason}\n\n${data?.notes || ''}` : data?.notes
      })
      .eq('id', id)
      .select(`
        *,
        category:expense_categories(*),
        tour_leader:crew_members!expense_items_tour_leader_id_fkey(id, full_name),
        approver:crew_members!expense_items_approved_by_fkey(id, full_name)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Expense Budgets
  async getExpenseBudgetsByTour(tourId: string): Promise<ExpenseBudget[]> {
    const { data, error } = await supabase
      .from('expense_budgets')
      .select(`
        *,
        category:expense_categories(*)
      `)
      .eq('tour_id', tourId)
      .order('category_id');
    
    if (error) throw error;
    return data || [];
  }

  async createExpenseBudget(budgetData: CreateExpenseBudgetData): Promise<ExpenseBudget> {
    const { data, error } = await supabase
      .from('expense_budgets')
      .insert(budgetData)
      .select(`
        *,
        category:expense_categories(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateExpenseBudget(id: string, budgetedAmount: number): Promise<ExpenseBudget> {
    const { data, error } = await supabase
      .from('expense_budgets')
      .update({ budgeted_amount: budgetedAmount })
      .eq('id', id)
      .select(`
        *,
        category:expense_categories(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteExpenseBudget(id: string): Promise<void> {
    const { error } = await supabase
      .from('expense_budgets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Expense Reconciliations
  async getExpenseReconciliations(): Promise<ExpenseReconciliation[]> {
    const { data, error } = await supabase
      .from('expense_reconciliations')
      .select(`
        *,
        tour_leader:crew_members!expense_reconciliations_tour_leader_id_fkey(id, full_name),
        office_staff:crew_members!expense_reconciliations_office_staff_id_fkey(id, full_name),
        tour:tours(id, tour_code, tour_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createExpenseReconciliation(
    tourId: string, 
    tourLeaderId: string, 
    officeStaffId: string
  ): Promise<ExpenseReconciliation> {
    // Get budget and actual totals
    const budgets = await this.getExpenseBudgetsByTour(tourId);
    const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgeted_amount, 0);
    const totalActual = budgets.reduce((sum, budget) => sum + budget.actual_amount, 0);

    const { data, error } = await supabase
      .from('expense_reconciliations')
      .insert({
        tour_id: tourId,
        tour_leader_id: tourLeaderId,
        office_staff_id: officeStaffId,
        total_budgeted: totalBudgeted,
        total_actual: totalActual,
        reconciliation_date: new Date().toISOString().split('T')[0]
      })
      .select(`
        *,
        tour_leader:crew_members!expense_reconciliations_tour_leader_id_fkey(id, full_name),
        office_staff:crew_members!expense_reconciliations_office_staff_id_fkey(id, full_name),
        tour:tours(id, tour_code, tour_name)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateExpenseReconciliation(
    id: string, 
    status: 'approved' | 'rejected', 
    notes?: string
  ): Promise<ExpenseReconciliation> {
    const { data, error } = await supabase
      .from('expense_reconciliations')
      .update({
        status,
        notes: notes || data?.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        tour_leader:crew_members!expense_reconciliations_tour_leader_id_fkey(id, full_name),
        office_staff:crew_members!expense_reconciliations_office_staff_id_fkey(id, full_name),
        tour:tours(id, tour_code, tour_name)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Expense Summary and Analytics
  async getExpenseSummaryByTour(tourId: string): Promise<ExpenseSummary> {
    const budgets = await this.getExpenseBudgetsByTour(tourId);
    const items = await this.getExpenseItemsByTour(tourId);
    
    const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgeted_amount, 0);
    const totalActual = budgets.reduce((sum, budget) => sum + budget.actual_amount, 0);
    
    const categoryBreakdown = budgets.map(budget => {
      const categoryItems = items.filter(item => 
        item.category_id === budget.category_id && item.status === 'approved'
      );
      const actualAmount = categoryItems.reduce((sum, item) => sum + item.amount, 0);
      
      return {
        category_id: budget.category_id,
        category_name: budget.category?.name || 'Unknown',
        budgeted_amount: budget.budgeted_amount,
        actual_amount: actualAmount,
        variance: actualAmount - budget.budgeted_amount,
        item_count: categoryItems.length
      };
    });

    return {
      tour_id: tourId,
      total_budgeted: totalBudgeted,
      total_actual: totalActual,
      total_variance: totalActual - totalBudgeted,
      category_breakdown: categoryBreakdown
    };
  }

  async getExpenseAnalytics(): Promise<{
    totalExpenses: number;
    totalBudgeted: number;
    totalVariance: number;
    categoryBreakdown: {
      category_name: string;
      total_amount: number;
      item_count: number;
    }[];
    monthlyTrends: {
      month: string;
      total_amount: number;
      item_count: number;
    }[];
  }> {
    // This would be a more complex query for analytics
    // For now, return basic structure
    return {
      totalExpenses: 0,
      totalBudgeted: 0,
      totalVariance: 0,
      categoryBreakdown: [],
      monthlyTrends: []
    };
  }
}

export const expenseService = new ExpenseService();
