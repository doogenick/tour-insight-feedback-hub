// Check if the feedback_gathering_status column exists in the tours table
import { supabase } from '@/integrations/supabase/client';

export async function checkDatabaseSchema() {
  console.log('🔍 Checking database schema...');
  
  try {
    // Try to query the feedback_gathering_status column
    const { data, error } = await supabase
      .from('tours')
      .select('id, tour_code, feedback_gathering_status')
      .limit(1);
    
    if (error) {
      console.error('❌ Schema check failed:', error);
      return { 
        success: false, 
        error: error.message,
        needsMigration: error.message.includes('column "feedback_gathering_status" does not exist')
      };
    }
    
    console.log('✅ feedback_gathering_status column exists');
    console.log('📊 Sample data:', data);
    
    return { 
      success: true, 
      message: 'Schema is up to date',
      sampleData: data
    };
    
  } catch (error) {
    console.error('❌ Schema check failed with exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      needsMigration: true
    };
  }
}
