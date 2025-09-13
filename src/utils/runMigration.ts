// Run the feedback_gathering_status migration
import { supabase } from '@/integrations/supabase/client';

export async function runMigration() {
  console.log('🔄 Running migration for feedback_gathering_status...');
  
  try {
    // Check if column already exists
    const { data: existingColumn, error: checkError } = await supabase
      .from('tours')
      .select('feedback_gathering_status')
      .limit(1);
    
    if (!checkError) {
      console.log('✅ Column already exists, migration not needed');
      return { success: true, message: 'Migration already applied' };
    }
    
    if (!checkError.message.includes('column "feedback_gathering_status" does not exist')) {
      throw new Error(`Unexpected error: ${checkError.message}`);
    }
    
    console.log('📝 Column does not exist, running migration...');
    
    // Run the migration SQL
    const migrationSQL = `
      ALTER TABLE tours 
      ADD COLUMN feedback_gathering_status TEXT NOT NULL DEFAULT 'inactive' 
      CHECK (feedback_gathering_status IN ('inactive', 'active', 'completed'));
      
      CREATE INDEX IF NOT EXISTS idx_tours_feedback_gathering_status ON tours(feedback_gathering_status);
      
      UPDATE tours 
      SET feedback_gathering_status = 'inactive' 
      WHERE feedback_gathering_status IS NULL;
    `;
    
    const { error: migrationError } = await supabase.rpc('exec_sql', { 
      sql: migrationSQL 
    });
    
    if (migrationError) {
      console.error('❌ Migration failed:', migrationError);
      return { success: false, error: migrationError.message };
    }
    
    console.log('✅ Migration completed successfully');
    return { success: true, message: 'Migration applied successfully' };
    
  } catch (error) {
    console.error('❌ Migration failed with exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
