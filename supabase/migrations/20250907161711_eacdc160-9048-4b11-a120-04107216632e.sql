-- Update RLS policies to allow mobile app tour creation
-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Allow authenticated users full access to tours" ON tours;

-- Create separate policies for different operations
-- Allow anyone to create tours (needed for mobile app)
CREATE POLICY "Allow tour creation" 
ON tours 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read tours 
CREATE POLICY "Allow tour reading" 
ON tours 
FOR SELECT 
USING (true);

-- Only allow authenticated users to update tours
CREATE POLICY "Allow authenticated tour updates" 
ON tours 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Only allow authenticated users to delete tours
CREATE POLICY "Allow authenticated tour deletion" 
ON tours 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Update crew_members policies similarly
DROP POLICY IF EXISTS "Allow authenticated users full access to crew_members" ON crew_members;

-- Allow reading crew members (needed for dropdowns in mobile app)
CREATE POLICY "Allow crew reading" 
ON crew_members 
FOR SELECT 
USING (true);

-- Only authenticated users can modify crew
CREATE POLICY "Allow authenticated crew management" 
ON crew_members 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);