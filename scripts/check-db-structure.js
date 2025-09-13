import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://rgqbdlebshwspakxywgp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWJkbGVic2h3c3Bha3h5d2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDAzNjgsImV4cCI6MjA3MTM3NjM2OH0.d3rEcwC3wHh6QOQy2OcszOitEDXZ6e9XSOeUOrH8VJk";

async function checkDatabaseStructure() {
  console.log('🔍 Checking database structure and policies...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Check if version columns exist
    console.log('\n📊 Checking tours table structure...');
    const { data: toursData, error: toursError } = await supabase
      .from('tours')
      .select('*')
      .limit(1);
    
    if (toursError) {
      console.error('❌ Error accessing tours table:', toursError);
    } else {
      console.log('✅ Tours table accessible');
      if (toursData && toursData.length > 0) {
        const columns = Object.keys(toursData[0]);
        console.log('📋 Tours columns:', columns);
        console.log('🔍 Has app_version:', columns.includes('app_version'));
        console.log('🔍 Has created_by_client:', columns.includes('created_by_client'));
      }
    }
    
    // Check comprehensive_feedback table
    console.log('\n📊 Checking comprehensive_feedback table structure...');
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('comprehensive_feedback')
      .select('*')
      .limit(1);
    
    if (feedbackError) {
      console.error('❌ Error accessing comprehensive_feedback table:', feedbackError);
    } else {
      console.log('✅ Comprehensive_feedback table accessible');
      if (feedbackData && feedbackData.length > 0) {
        const columns = Object.keys(feedbackData[0]);
        console.log('📋 Feedback columns:', columns);
        console.log('🔍 Has app_version:', columns.includes('app_version'));
        console.log('🔍 Has submitted_by_client:', columns.includes('submitted_by_client'));
      }
    }
    
    // Test creating a tour (this will show us the current policy behavior)
    console.log('\n🧪 Testing tour creation...');
    const testTour = {
      tour_code: 'TEST_' + Date.now(),
      tour_name: 'Test Tour',
      feedback_gathering_status: 'inactive'
    };
    
    const { data: createData, error: createError } = await supabase
      .from('tours')
      .insert(testTour)
      .select();
    
    if (createError) {
      console.log('❌ Tour creation failed (expected due to policies):', createError.message);
      console.log('🔍 Error code:', createError.code);
      console.log('🔍 Error details:', createError.details);
    } else {
      console.log('✅ Tour creation succeeded:', createData);
      
      // Clean up test tour
      if (createData && createData.length > 0) {
        await supabase
          .from('tours')
          .delete()
          .eq('id', createData[0].id);
        console.log('🧹 Test tour cleaned up');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkDatabaseStructure();
