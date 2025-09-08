-- Drop existing restrictive policies that block sync
DROP POLICY IF EXISTS "Allow feedback submission" ON public.comprehensive_feedback;
DROP POLICY IF EXISTS "Allow authenticated users to view feedback" ON public.comprehensive_feedback;
DROP POLICY IF EXISTS "Allow authenticated users to update feedback" ON public.comprehensive_feedback;
DROP POLICY IF EXISTS "Allow authenticated users to delete feedback" ON public.comprehensive_feedback;

-- Create new policies that allow unauthenticated sync operations
-- Allow anyone to insert feedback (needed for offline sync)
CREATE POLICY "Allow feedback sync and submission" 
ON public.comprehensive_feedback 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view feedback (needed for analytics)
CREATE POLICY "Allow feedback viewing" 
ON public.comprehensive_feedback 
FOR SELECT 
USING (true);

-- Allow authenticated users to update and delete
CREATE POLICY "Allow authenticated feedback updates" 
ON public.comprehensive_feedback 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated feedback deletion" 
ON public.comprehensive_feedback 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Also fix tours table policies to allow unauthenticated sync
DROP POLICY IF EXISTS "Allow tour creation" ON public.tours;
CREATE POLICY "Allow tour sync and creation" 
ON public.tours 
FOR INSERT 
WITH CHECK (true);