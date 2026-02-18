import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserCreation() {
  try {
    console.log("Testing user creation with phoneCode...");

    // First, check if phone_code column exists
    console.log("Checking table structure...");
    const { data: columns, error: columnError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type")
      .eq("table_name", "users")
      .eq("table_schema", "public")
      .eq("column_name", "phone_code");

    if (columnError) {
      console.error("Error checking columns:", columnError);
    } else {
      console.log("Phone code column exists:", columns.length > 0);
      if (columns.length === 0) {
        console.log("❌ phone_code column does NOT exist in users table");
        console.log(
          "Please run: ALTER TABLE public.users ADD COLUMN phone_code VARCHAR(10);",
        );
        return;
      }
    }

    // Test creating a user
    const testUser = {
      name: "Test User",
      email: "test@example.com",
      role: "user",
      status: "active",
      phone_code: "+1",
      phone: "1234567890",
      department: "Test Dept",
    };

    console.log("Attempting to create user:", testUser);

    const { data, error } = await supabase
      .from("users")
      .insert([testUser])
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating user:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    } else {
      console.log("✅ User created successfully:", data);

      // Clean up - delete the test user
      await supabase.from("users").delete().eq("email", "test@example.com");
      console.log("✅ Test user cleaned up");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

testUserCreation();
