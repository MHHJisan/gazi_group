import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing database connection...');
  
  try {
    // Get the connection string from environment
    const connectionString = process.env.POSTGRES_URL;
    
    if (!connectionString) {
      throw new Error('POSTGRES_URL not found in environment variables');
    }
    
    console.log('Connection string found, attempting to connect...');
    
    // Create postgres client
    const client = postgres(connectionString);
    
    // Create drizzle instance
    const db = drizzle(client);
    
    // Test the connection with a simple query
    const result = await client`SELECT NOW() as current_time, version() as postgres_version`;
    
    console.log('✅ Database connection successful!');
    console.log('Current time:', result[0].current_time);
    console.log('PostgreSQL version:', result[0].postgres_version);
    
    // Test if we can query tables
    try {
      const tables = await client`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      
      console.log('📋 Existing tables:', tables.map(t => t.table_name));
    } catch (err) {
      console.log('ℹ️ Could not fetch tables (this is normal for new databases)');
    }
    
    await client.end();
    return true;
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
