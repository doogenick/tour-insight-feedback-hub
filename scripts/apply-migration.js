import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = "https://rgqbdlebshwspakxywgp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWJkbGVic2h3c3Bha3h5d2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDAzNjgsImV4cCI6MjA3MTM3NjM2OH0.d3rEcwC3wHh6QOQy2OcszOitEDXZ6e9XSOeUOrH8VJk";

async function applyMigration() {
  console.log('🚀 Applying database migration via Supabase client...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250109000002_add_app_version_tracking.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration file loaded');
    console.log('📝 Migration SQL:');
    console.log('─'.repeat(50));
    console.log(migrationSQL);
    console.log('─'.repeat(50));
    
    // Since we can't execute raw SQL directly with the anon key,
    // let's test the connection and provide instructions
    console.log('\n🔧 Since we need elevated permissions to run migrations,');
    console.log('   please copy the migration SQL above and run it in your Supabase dashboard:');
    console.log('\n1. Go to: https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Paste the migration SQL above');
    console.log('5. Click "Run"');
    
    // Test basic connection
    const { data, error } = await supabase.from('tours').select('count').limit(1);
    if (error) {
      console.error('❌ Connection test failed:', error);
    } else {
      console.log('✅ Supabase connection test successful');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

applyMigration();
