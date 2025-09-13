-- Fix web app access by updating RLS policies
-- Allow web app to create tours and feedback without version restrictions

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only live app can write tours" ON tours;
DROP POLICY IF EXISTS "Only live app can write feedback" ON comprehensive_feedback;

-- Create new policies that allow both web and mobile app access
-- Web app: no version tracking (app_version IS NULL)
-- Mobile app: version 1.0.6 with proper client identifier

-- Tours: Allow web app (no version) and mobile app (version 1.0.6)
CREATE POLICY "Allow web and mobile app to write tours" ON tours
  FOR INSERT WITH CHECK (
    (app_version IS NULL) OR 
    (app_version = '1.0.6' AND created_by_client = 'nomad-feedback-mobile')
  );

-- Feedback: Allow web app (no version) and mobile app (version 1.0.6)  
CREATE POLICY "Allow web and mobile app to write feedback" ON comprehensive_feedback
  FOR INSERT WITH CHECK (
    (app_version IS NULL) OR 
    (app_version = '1.0.6' AND submitted_by_client = 'nomad-feedback-mobile')
  );

-- Update existing data to mark web app entries
UPDATE tours 
SET created_by_client = 'web-app' 
WHERE app_version IS NULL AND created_by_client = 'nomad-feedback-mobile';

UPDATE comprehensive_feedback 
SET submitted_by_client = 'web-app' 
WHERE app_version IS NULL AND submitted_by_client = 'nomad-feedback-mobile';

-- Add comment explaining the updated policies
COMMENT ON POLICY "Allow web and mobile app to write tours" ON tours IS 'Allows both web app (no version) and mobile app (version 1.0.6) to create tours';
COMMENT ON POLICY "Allow web and mobile app to write feedback" ON comprehensive_feedback IS 'Allows both web app (no version) and mobile app (version 1.0.6) to submit feedback';
