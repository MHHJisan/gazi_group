import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local', override: false });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAddressColumn() {
  try {
    console.log('Adding address column to entities table...');
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE entities ADD COLUMN IF NOT EXISTS address text;'
    });
    
    if (error) {
      console.error('Error adding column:', error);
      
      // Try alternative approach using raw SQL
      console.log('Trying alternative approach...');
      const { error: error2 } = await supabase
        .from('entities')
        .select('address')
        .limit(1);
      
      if (error2 && error2.message.includes('column "address" does not exist')) {
        console.log('Column does not exist. You need to run the migration manually in Supabase dashboard.');
        console.log('SQL to run: ALTER TABLE entities ADD COLUMN address text;');
      } else if (!error2) {
        console.log('Address column already exists!');
      }
    } else {
      console.log('Address column added successfully!');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

addAddressColumn();
