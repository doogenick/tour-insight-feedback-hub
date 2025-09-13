// Test Supabase connection and database schema
import { supabase } from '@/integrations/supabase/client';
import { checkDatabaseSchema } from './checkDatabaseSchema';

export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('tours')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Connection test failed:', connectionError);
      return { success: false, error: connectionError.message };
    }
    
    console.log('✅ Basic connection successful');
    
    // Test 2: Check database schema
    const schemaCheck = await checkDatabaseSchema();
    if (!schemaCheck.success) {
      console.error('❌ Schema check failed:', schemaCheck.error);
      return { 
        success: false, 
        error: `Schema issue: ${schemaCheck.error}`,
        needsMigration: schemaCheck.needsMigration
      };
    }
    
    console.log('✅ Database schema is up to date');
    
    // Test 3: Try to create a test tour
    const testTourData = {
      tour_code: `TEST_${Date.now()}`,
      tour_name: 'Test Tour',
      date_start: new Date().toISOString().slice(0, 10),
      date_end: new Date().toISOString().slice(0, 10),
      passenger_count: 0,
      tour_type: 'camping',
      crew_count: 1,
      vehicle_type: 'truck',
      status: 'active',
      feedback_gathering_status: 'active'
    };
    
    const { data: createTest, error: createError } = await supabase
      .from('tours')
      .insert([testTourData])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Create test failed:', createError);
      return { success: false, error: `Create test failed: ${createError.message}` };
    }
    
    console.log('✅ Tour creation test successful');
    
    // Clean up test tour
    await supabase
      .from('tours')
      .delete()
      .eq('id', createTest.id);
    
    console.log('✅ Test tour cleaned up');
    
    return { success: true, message: 'All tests passed' };
    
  } catch (error) {
    console.error('❌ Test failed with exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
