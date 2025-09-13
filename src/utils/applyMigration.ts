// Apply the feedback_gathering_status migration directly
import { supabase } from '@/integrations/supabase/client';

export async function applyMigration() {
  console.log('🔄 Applying feedback_gathering_status migration...');
  
  try {
    // First, check if the column exists
    const { data: testData, error: testError } = await supabase
      .from('tours')
      .select('feedback_gathering_status')
      .limit(1);
    
    if (!testError) {
      console.log('✅ Column already exists');
      return { success: true, message: 'Migration already applied' };
    }
    
    console.log('📝 Column does not exist, applying migration...');
    
    // Try to add the column using a direct SQL query
    const { error: alterError } = await supabase
      .rpc('exec', { 
        sql: `ALTER TABLE tours ADD COLUMN IF NOT EXISTS feedback_gathering_status TEXT NOT NULL DEFAULT 'inactive'` 
      });
    
    if (alterError) {
      console.error('❌ Failed to add column:', alterError);
      return { success: false, error: alterError.message };
    }
    
    // Add the check constraint
    const { error: checkError } = await supabase
      .rpc('exec', { 
        sql: `ALTER TABLE tours ADD CONSTRAINT IF NOT EXISTS check_feedback_gathering_status CHECK (feedback_gathering_status IN ('inactive', 'active', 'completed'))` 
      });
    
    if (checkError) {
      console.warn('⚠️ Could not add check constraint:', checkError.message);
    }
    
    // Create index
    const { error: indexError } = await supabase
      .rpc('exec', { 
        sql: `CREATE INDEX IF NOT EXISTS idx_tours_feedback_gathering_status ON tours(feedback_gathering_status)` 
      });
    
    if (indexError) {
      console.warn('⚠️ Could not create index:', indexError.message);
    }
    
    // Update existing tours
    const { error: updateError } = await supabase
      .rpc('exec', { 
        sql: `UPDATE tours SET feedback_gathering_status = 'inactive' WHERE feedback_gathering_status IS NULL` 
      });
    
    if (updateError) {
      console.warn('⚠️ Could not update existing tours:', updateError.message);
    }
    
    console.log('✅ Migration applied successfully');
    return { success: true, message: 'Migration applied successfully' };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
