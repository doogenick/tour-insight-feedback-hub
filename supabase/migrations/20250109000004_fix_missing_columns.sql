-- Fix missing columns and policies for web app access
-- This migration ensures all required columns exist and web app can access the database

-- Add missing feedback_gathering_status column to tours table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS feedback_gathering_status TEXT DEFAULT 'inactive' CHECK (feedback_gathering_status IN ('inactive', 'active', 'completed'));

-- Ensure app_version and created_by_client columns exist with proper defaults
ALTER TABLE tours ALTER COLUMN app_version SET DEFAULT NULL;
ALTER TABLE tours ALTER COLUMN created_by_client SET DEFAULT 'web-app';

-- Ensure comprehensive_feedback columns exist with proper defaults  
ALTER TABLE comprehensive_feedback ALTER COLUMN app_version SET DEFAULT NULL;
ALTER TABLE comprehensive_feedback ALTER COLUMN submitted_by_client SET DEFAULT 'web-app';

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only live app can write tours" ON tours;
DROP POLICY IF EXISTS "Only live app can write feedback" ON comprehensive_feedback;
DROP POLICY IF EXISTS "Allow web and mobile app to write tours" ON tours;
DROP POLICY IF EXISTS "Allow web and mobile app to write feedback" ON comprehensive_feedback;

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
WHERE created_by_client = 'nomad-feedback-mobile' AND app_version IS NULL;

UPDATE comprehensive_feedback 
SET submitted_by_client = 'web-app' 
WHERE submitted_by_client = 'nomad-feedback-mobile' AND app_version IS NULL;

-- Add comment explaining the updated policies
COMMENT ON POLICY "Allow web and mobile app to write tours" ON tours IS 'Allows both web app (no version) and mobile app (version 1.0.6) to create tours';
COMMENT ON POLICY "Allow web and mobile app to write feedback" ON comprehensive_feedback IS 'Allows both web app (no version) and mobile app (version 1.0.6) to submit feedback';
