-- Add app version tracking and access control
-- This migration adds version tracking and ensures only the live app can write data

-- Add app_version column to tours table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS app_version TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS created_by_client TEXT DEFAULT 'nomad-feedback-mobile';

-- Add app_version column to comprehensive_feedback table
ALTER TABLE comprehensive_feedback ADD COLUMN IF NOT EXISTS app_version TEXT;
ALTER TABLE comprehensive_feedback ADD COLUMN IF NOT EXISTS submitted_by_client TEXT DEFAULT 'nomad-feedback-mobile';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_tours_app_version ON tours(app_version);
CREATE INDEX IF NOT EXISTS idx_feedback_app_version ON comprehensive_feedback(app_version);

-- Add RLS policies to ensure only live app can write data
-- Allow reading all data, but only current app can write new data

-- Tours: Allow reading all, writing only from current app
CREATE POLICY IF NOT EXISTS "Allow read all tours" ON tours
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Only live app can write tours" ON tours
  FOR INSERT WITH CHECK (
    app_version = '1.0.6' AND 
    created_by_client = 'nomad-feedback-mobile'
  );

CREATE POLICY IF NOT EXISTS "Only live app can update tours" ON tours
  FOR UPDATE USING (
    created_by_client = 'nomad-feedback-mobile' OR 
    created_by_client = 'legacy-app'
  );

-- Feedback: Allow reading all, writing only from current app
CREATE POLICY IF NOT EXISTS "Allow read all feedback" ON comprehensive_feedback
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Only live app can write feedback" ON comprehensive_feedback
  FOR INSERT WITH CHECK (
    app_version = '1.0.6' AND 
    submitted_by_client = 'nomad-feedback-mobile'
  );

CREATE POLICY IF NOT EXISTS "Only live app can update feedback" ON comprehensive_feedback
  FOR UPDATE USING (
    submitted_by_client = 'nomad-feedback-mobile' OR 
    submitted_by_client = 'legacy-app'
  );

-- Add function to mark old app data as legacy (preserve all data)
CREATE OR REPLACE FUNCTION mark_old_app_data_as_legacy()
RETURNS void AS $$
BEGIN
  -- Mark old app data as legacy but keep it active
  UPDATE tours 
  SET created_by_client = 'legacy-app' 
  WHERE app_version IS NOT NULL 
    AND app_version != '1.0.6' 
    AND created_by_client != 'nomad-feedback-mobile';
    
  UPDATE comprehensive_feedback 
  SET submitted_by_client = 'legacy-app' 
  WHERE app_version IS NOT NULL 
    AND app_version != '1.0.6' 
    AND submitted_by_client != 'nomad-feedback-mobile';
    
  -- Log the legacy marking
  INSERT INTO comprehensive_feedback (
    tour_id,
    client_name,
    client_email,
    additional_comments,
    submitted_at,
    app_version,
    submitted_by_client
  ) VALUES (
    NULL,
    'System',
    'system@nomadtours.com',
    'Legacy app data marked - all historical data preserved',
    NOW(),
    '1.0.6',
    'nomad-feedback-mobile'
  );
END;
$$ LANGUAGE plpgsql;

-- Add comment explaining the version tracking
COMMENT ON COLUMN tours.app_version IS 'App version that created this tour (e.g., 1.0.6)';
COMMENT ON COLUMN tours.created_by_client IS 'Client identifier that created this tour';
COMMENT ON COLUMN comprehensive_feedback.app_version IS 'App version that submitted this feedback';
COMMENT ON COLUMN comprehensive_feedback.submitted_by_client IS 'Client identifier that submitted this feedback';
