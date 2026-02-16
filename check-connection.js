import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local', override: false });

console.log('=== Environment Variables Check ===');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');

// Test URL format
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  console.log('URL format:', supabaseUrl);
  console.log('Hostname:', supabaseUrl.split('//')[1]?.split('/')[0]);
  console.log('Protocol:', supabaseUrl.split(':')[0]);
  
  // Expected format: https://[project-ref].supabase.co
  const expectedPattern = /^https:\/\/[a-zA-Z0-9]+\.supabase\.co/;
  const isValid = expectedPattern.test(supabaseUrl);
  
  console.log('URL is valid:', isValid);
  
  if (!isValid) {
    console.log('❌ URL format looks incorrect');
    console.log('Expected: https://[project-ref].supabase.co');
    console.log('Actual:', supabaseUrl);
  }
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL not set');
}
