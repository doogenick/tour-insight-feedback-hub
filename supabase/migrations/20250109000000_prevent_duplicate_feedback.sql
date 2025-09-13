-- Add unique constraint to prevent duplicate feedback submissions
-- This ensures that the same client (name + email) cannot submit feedback for the same tour more than once

-- First, let's clean up any existing duplicates before adding the constraint
-- We'll keep the most recent submission for each client-tour combination
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY tour_id, client_name, client_email 
      ORDER BY submitted_at DESC, created_at DESC
    ) as rn
  FROM comprehensive_feedback
  WHERE client_name IS NOT NULL 
    AND client_email IS NOT NULL 
    AND client_name != '' 
    AND client_email != ''
)
DELETE FROM comprehensive_feedback 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Add unique constraint to prevent future duplicates
-- This constraint ensures that the combination of tour_id, client_name, and client_email is unique
-- Only applies when both client_name and client_email are not null and not empty
ALTER TABLE comprehensive_feedback 
ADD CONSTRAINT unique_client_feedback_per_tour 
UNIQUE (tour_id, client_name, client_email);

-- Add a partial index for better performance on duplicate checks
-- This index only includes rows where both name and email are present
CREATE INDEX IF NOT EXISTS idx_comprehensive_feedback_client_tour 
ON comprehensive_feedback (tour_id, client_name, client_email) 
WHERE client_name IS NOT NULL 
  AND client_email IS NOT NULL 
  AND client_name != '' 
  AND client_email != '';

-- Add a comment explaining the constraint
COMMENT ON CONSTRAINT unique_client_feedback_per_tour ON comprehensive_feedback 
IS 'Prevents duplicate feedback submissions from the same client (name + email) for the same tour';
