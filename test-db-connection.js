import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local', override: false });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing database connection...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing entities table...');
    const { data: entities, error: entitiesError } = await supabase
      .from('entities')
      .select('*')
      .limit(1);
    
    console.log('Entities result:', entitiesError || 'Success');
    
    console.log('Testing units table...');
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('*')
      .limit(1);
    
    console.log('Units result:', unitsError || 'Success');
    
    console.log('Testing transactions table...');
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .limit(1);
    
    console.log('Transactions result:', transactionsError || 'Success');
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();
