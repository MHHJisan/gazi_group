import { createClient } from "@supabase/supabase-js";

// Get environment variables (they're already available in browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAuthenticatedUserClient() {
  console.log("🔍 Client-side auth check starting...");

  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include", // Important for cookies
    });

    if (!response.ok) {
      console.log("❌ Auth check failed:", response.status);
      return null;
    }

    const data = await response.json();
    console.log("📊 Auth API result:", data);

    if (data.authenticated && data.user) {
      console.log(
        "✅ User authenticated:",
        data.user.email,
        `(${data.authMethod})`,
      );
      return data.user;
    }

    console.log("❌ User not authenticated");
    return null;
  } catch (error) {
    console.log("❌ Auth check error:", error);
    return null;
  }
}
