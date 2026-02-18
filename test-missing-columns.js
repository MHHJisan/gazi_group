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

async function addMissingColumns() {
  try {
    console.log('Adding missing columns to users table...');
    
    // Test creating a user with the new fields to check if columns exist
    const testUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      role: 'user',
      status: 'active',
      phone_code: '+1',
      phone: '1234567890',
      password: 'testpassword123',
      department: 'Test Dept'
    };
    
    console.log('Testing user creation with all fields...');
    
    const { data, error } = await supabase
      .from('users')
      .insert([testUser])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating user:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      if (error.code === 'PGRST204') {
        console.log('\n❌ Missing columns detected.');
        console.log('Please run this SQL in your Supabase dashboard:');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password VARCHAR(255);');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_code VARCHAR(10);');
      }
    } else {
      console.log('✅ User created successfully with all fields:', data);
      
      // Clean up - delete the test user
      await supabase
        .from('users')
        .delete()
        .eq('email', testUser.email);
      console.log('✅ Test user cleaned up');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addMissingColumns();
