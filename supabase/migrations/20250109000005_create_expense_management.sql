-- Create expense categories table
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default expense categories
INSERT INTO expense_categories (name, description) VALUES
  ('Park Fees', 'National park entry fees and permits'),
  ('Fuel', 'Vehicle fuel costs'),
  ('Tolls', 'Road tolls and bridge fees'),
  ('Activities', 'Activity bookings and entrance fees'),
  ('Accommodation', 'Lodging costs paid on tour'),
  ('Border Crossing', 'Border crossing fees and visas'),
  ('Meals', 'Food and meal costs'),
  ('Ice', 'Ice purchases for coolers'),
  ('Emergency', 'Emergency repairs and mechanical costs'),
  ('Miscellaneous', 'Other tour-related expenses')
ON CONFLICT (name) DO NOTHING;

-- Create expense items table
CREATE TABLE IF NOT EXISTS expense_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES expense_categories(id),
  tour_leader_id UUID REFERENCES crew_members(id),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'USD',
  expense_date DATE NOT NULL,
  location TEXT,
  receipt_number TEXT,
  receipt_image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'reconciled')),
  notes TEXT,
  created_by UUID REFERENCES crew_members(id),
  approved_by UUID REFERENCES crew_members(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expense budgets table for tour planning
CREATE TABLE IF NOT EXISTS expense_budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES expense_categories(id),
  budgeted_amount DECIMAL(10,2) NOT NULL CHECK (budgeted_amount >= 0),
  actual_amount DECIMAL(10,2) DEFAULT 0,
  variance DECIMAL(10,2) GENERATED ALWAYS AS (actual_amount - budgeted_amount) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tour_id, category_id)
);

-- Create expense reconciliations table
CREATE TABLE IF NOT EXISTS expense_reconciliations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  tour_leader_id UUID NOT NULL REFERENCES crew_members(id),
  office_staff_id UUID NOT NULL REFERENCES crew_members(id),
  total_budgeted DECIMAL(10,2) NOT NULL,
  total_actual DECIMAL(10,2) NOT NULL,
  total_variance DECIMAL(10,2) GENERATED ALWAYS AS (total_actual - total_budgeted) STORED,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reconciliation_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expense_items_tour_id ON expense_items(tour_id);
CREATE INDEX IF NOT EXISTS idx_expense_items_category_id ON expense_items(category_id);
CREATE INDEX IF NOT EXISTS idx_expense_items_status ON expense_items(status);
CREATE INDEX IF NOT EXISTS idx_expense_items_expense_date ON expense_items(expense_date);
CREATE INDEX IF NOT EXISTS idx_expense_budgets_tour_id ON expense_budgets(tour_id);
CREATE INDEX IF NOT EXISTS idx_expense_reconciliations_tour_id ON expense_reconciliations(tour_id);

-- Add RLS policies
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_reconciliations ENABLE ROW LEVEL SECURITY;

-- Allow all users to read expense categories
CREATE POLICY "Allow read access to expense categories" ON expense_categories
  FOR SELECT USING (true);

-- Allow tour leaders and office staff to manage expense items
CREATE POLICY "Allow tour leaders to manage their tour expenses" ON expense_items
  FOR ALL USING (
    tour_leader_id = auth.uid() OR 
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM tours t 
      WHERE t.id = tour_id 
      AND (t.guide_id = auth.uid() OR t.driver_id = auth.uid())
    )
  );

-- Allow office staff to manage all expense items
CREATE POLICY "Allow office staff to manage all expenses" ON expense_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM crew_members cm 
      WHERE cm.id = auth.uid() 
      AND cm.role IN ('office_staff', 'admin', 'manager')
    )
  );

-- Allow tour leaders to manage their tour budgets
CREATE POLICY "Allow tour leaders to manage tour budgets" ON expense_budgets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tours t 
      WHERE t.id = tour_id 
      AND (t.guide_id = auth.uid() OR t.driver_id = auth.uid())
    )
  );

-- Allow office staff to manage all budgets
CREATE POLICY "Allow office staff to manage all budgets" ON expense_budgets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM crew_members cm 
      WHERE cm.id = auth.uid() 
      AND cm.role IN ('office_staff', 'admin', 'manager')
    )
  );

-- Allow tour leaders to manage their reconciliations
CREATE POLICY "Allow tour leaders to manage their reconciliations" ON expense_reconciliations
  FOR ALL USING (
    tour_leader_id = auth.uid()
  );

-- Allow office staff to manage all reconciliations
CREATE POLICY "Allow office staff to manage all reconciliations" ON expense_reconciliations
  FOR ALL USING (
    office_staff_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM crew_members cm 
      WHERE cm.id = auth.uid() 
      AND cm.role IN ('office_staff', 'admin', 'manager')
    )
  );

-- Create function to update actual amounts when expenses are approved
CREATE OR REPLACE FUNCTION update_budget_actual_amounts()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update when status changes to approved
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    UPDATE expense_budgets 
    SET actual_amount = (
      SELECT COALESCE(SUM(amount), 0)
      FROM expense_items 
      WHERE tour_id = NEW.tour_id 
      AND category_id = NEW.category_id 
      AND status = 'approved'
    )
    WHERE tour_id = NEW.tour_id AND category_id = NEW.category_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update budget actual amounts
CREATE TRIGGER trigger_update_budget_actual_amounts
  AFTER INSERT OR UPDATE ON expense_items
  FOR EACH ROW
  EXECUTE FUNCTION update_budget_actual_amounts();
