export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExpenseItem {
  id: string;
  tour_id: string;
  category_id: string;
  tour_leader_id?: string;
  description: string;
  amount: number;
  currency: string;
  expense_date: string;
  location?: string;
  receipt_number?: string;
  receipt_image_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'reconciled';
  notes?: string;
  created_by?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  category?: ExpenseCategory;
  tour_leader?: {
    id: string;
    full_name: string;
  };
  approver?: {
    id: string;
    full_name: string;
  };
}

export interface ExpenseBudget {
  id: string;
  tour_id: string;
  category_id: string;
  budgeted_amount: number;
  actual_amount: number;
  variance: number;
  created_at: string;
  updated_at: string;
  
  // Joined data
  category?: ExpenseCategory;
}

export interface ExpenseReconciliation {
  id: string;
  tour_id: string;
  tour_leader_id: string;
  office_staff_id: string;
  total_budgeted: number;
  total_actual: number;
  total_variance: number;
  status: 'pending' | 'approved' | 'rejected';
  reconciliation_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  tour_leader?: {
    id: string;
    full_name: string;
  };
  office_staff?: {
    id: string;
    full_name: string;
  };
  tour?: {
    id: string;
    tour_code: string;
    tour_name: string;
  };
}

export interface ExpenseSummary {
  tour_id: string;
  total_budgeted: number;
  total_actual: number;
  total_variance: number;
  category_breakdown: {
    category_id: string;
    category_name: string;
    budgeted_amount: number;
    actual_amount: number;
    variance: number;
    item_count: number;
  }[];
}

export interface CreateExpenseItemData {
  tour_id: string;
  category_id: string;
  description: string;
  amount: number;
  currency?: string;
  expense_date: string;
  location?: string;
  receipt_number?: string;
  receipt_image_url?: string;
  notes?: string;
}

export interface CreateExpenseBudgetData {
  tour_id: string;
  category_id: string;
  budgeted_amount: number;
}

export interface UpdateExpenseItemData {
  category_id?: string;
  description?: string;
  amount?: number;
  currency?: string;
  expense_date?: string;
  location?: string;
  receipt_number?: string;
  receipt_image_url?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'reconciled';
  notes?: string;
}
