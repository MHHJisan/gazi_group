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

async function debugUsers() {
  try {
    console.log('🔍 Debugging users table...\n');
    
    // Get all users from the custom users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }
    
    console.log(`📊 Found ${users?.length || 0} users in custom table:`);
    users?.forEach((user, index) => {
      console.log(`\n${index + 1}. User Details:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log(`   Phone Code: ${user.phone_code || 'N/A'}`);
      console.log(`   Department: ${user.department || 'N/A'}`);
      console.log(`   Password: ${user.password ? 'SET' : 'NOT SET'}`);
      console.log(`   Created: ${user.created_at}`);
    });
    
    // Test specific email from logs
    const testEmail = 'tanim@mail.com';
    console.log(`\n🧪 Testing specific email: ${testEmail}`);
    
    const { data: specificUser, error: specificError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail);
    
    if (specificError) {
      console.error('❌ Error finding specific user:', specificError);
    } else {
      console.log(`📝 Found ${specificUser?.length || 0} users with email ${testEmail}:`);
      specificUser?.forEach((user, index) => {
        console.log(`   ${index + 1}. Password: ${user.password || 'NOT SET'}`);
        console.log(`   Full record:`, user);
      });
    }
    
    // Test login with exact credentials
    console.log(`\n🔐 Testing login process...`);
    const testPassword = 'password123'; // Common test password
    
    const { data: loginTest, error: loginError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .eq('password', testPassword)
      .single();
    
    if (loginError) {
      console.log(`❌ Login test failed with password "${testPassword}":`, loginError.message);
    } else {
      console.log(`✅ Login successful with password "${testPassword}":`, loginTest);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugUsers();
