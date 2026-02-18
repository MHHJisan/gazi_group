import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPhoneCodeColumn() {
  try {
    console.log('Adding phone_code column to users table...');
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_code VARCHAR(10);'
    });

    if (error) {
      console.error('Error adding column:', error);
      
      // Try alternative approach using raw SQL
      console.log('Trying alternative approach...');
      const { error: altError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
        
      if (altError) {
        console.error('Database connection error:', altError);
      } else {
        console.log('✅ Database connection successful');
        console.log('❌ You need to manually add the phone_code column to the users table');
        console.log('Run this SQL in your Supabase dashboard:');
        console.log('ALTER TABLE public.users ADD COLUMN phone_code VARCHAR(10);');
      }
    } else {
      console.log('✅ phone_code column added successfully');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addPhoneCodeColumn();
