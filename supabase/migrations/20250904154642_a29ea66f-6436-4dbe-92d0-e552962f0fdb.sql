-- Fix critical security vulnerability: Restrict access to comprehensive_feedback table
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on comprehensive_feedback" ON public.comprehensive_feedback;

-- Create secure RLS policies for comprehensive_feedback table
-- Allow anyone to submit feedback (for clients filling out forms)
CREATE POLICY "Allow feedback submission" 
ON public.comprehensive_feedback 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Only allow authenticated users to view feedback (for admin/tour operators)
CREATE POLICY "Allow authenticated users to view feedback" 
ON public.comprehensive_feedback 
FOR SELECT 
TO authenticated
USING (true);

-- Only allow authenticated users to update feedback
CREATE POLICY "Allow authenticated users to update feedback" 
ON public.comprehensive_feedback 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Only allow authenticated users to delete feedback
CREATE POLICY "Allow authenticated users to delete feedback" 
ON public.comprehensive_feedback 
FOR DELETE 
TO authenticated
USING (true);

-- Also secure the tours table while we're at it
DROP POLICY IF EXISTS "Allow all operations on tours" ON public.tours;

CREATE POLICY "Allow authenticated users full access to tours" 
ON public.tours 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- And secure the crew_members table
DROP POLICY IF EXISTS "Allow all operations on crew_members" ON public.crew_members;

CREATE POLICY "Allow authenticated users full access to crew_members" 
ON public.crew_members 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);