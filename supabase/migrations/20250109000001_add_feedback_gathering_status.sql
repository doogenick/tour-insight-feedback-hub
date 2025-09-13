-- Add feedback gathering status to tours table
ALTER TABLE tours 
ADD COLUMN feedback_gathering_status TEXT NOT NULL DEFAULT 'inactive' 
CHECK (feedback_gathering_status IN ('inactive', 'active', 'completed'));

-- Add comment explaining the status values
COMMENT ON COLUMN tours.feedback_gathering_status IS 
'Status of feedback gathering: inactive (not collecting), active (collecting feedback), completed (finished collecting)';

-- Create index for efficient querying by status
CREATE INDEX idx_tours_feedback_gathering_status ON tours(feedback_gathering_status);

-- Update existing tours to have appropriate status
-- You can customize this based on your needs
UPDATE tours 
SET feedback_gathering_status = 'inactive' 
WHERE feedback_gathering_status IS NULL;
