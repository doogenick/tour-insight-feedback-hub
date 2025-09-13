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

-- Add RLS policy to ensure only live app can write data
-- This policy ensures only the current app version can create/update records
CREATE POLICY IF NOT EXISTS "Only live app can write tours" ON tours
  FOR ALL USING (
    app_version IS NULL OR 
    app_version = '1.0.5' OR 
    created_by_client = 'nomad-feedback-mobile'
  );

CREATE POLICY IF NOT EXISTS "Only live app can write feedback" ON comprehensive_feedback
  FOR ALL USING (
    app_version IS NULL OR 
    app_version = '1.0.5' OR 
    submitted_by_client = 'nomad-feedback-mobile'
  );

-- Add function to clean up old app data
CREATE OR REPLACE FUNCTION cleanup_old_app_data()
RETURNS void AS $$
BEGIN
  -- Mark old app data as archived (don't delete to preserve history)
  UPDATE tours 
  SET feedback_gathering_status = 'inactive' 
  WHERE app_version IS NOT NULL 
    AND app_version != '1.0.5' 
    AND created_by_client != 'nomad-feedback-mobile';
    
  -- Log the cleanup
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
    'Old app data archived during cleanup',
    NOW(),
    '1.0.5',
    'nomad-feedback-mobile'
  );
END;
$$ LANGUAGE plpgsql;

-- Add comment explaining the version tracking
COMMENT ON COLUMN tours.app_version IS 'App version that created this tour (e.g., 1.0.5)';
COMMENT ON COLUMN tours.created_by_client IS 'Client identifier that created this tour';
COMMENT ON COLUMN comprehensive_feedback.app_version IS 'App version that submitted this feedback';
COMMENT ON COLUMN comprehensive_feedback.submitted_by_client IS 'Client identifier that submitted this feedback';
