// lib/admin-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createTestUser(
  email: string,
  password: string,
  name?: string,
) {
  const supabase = await createClient();

  try {
    // First try to create user with admin API (if available)
    // If that fails, fall back to regular signup
    let userData, authError;

    try {
      // Try admin user creation first
      const result = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: name || email.split("@")[0],
        },
      });
      userData = result.data;
      authError = result.error;
    } catch (adminError) {
      console.log("Admin creation not available, falling back to signup");
      // Fall back to regular signup
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
          data: {
            name: name || email.split("@")[0],
          },
        },
      });
      userData = result.data;
      authError = result.error;
    }

    if (authError) {
      console.error("Error creating user:", authError);
      return { success: false, error: authError.message };
    }

    // Create user profile in users table
    if (userData.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: userData.user.id,
        email: userData.user.email,
        name: name || email.split("@")[0],
        role: "user",
        status: "active",
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        // Don't fail the user creation, just log the error
      }
    }

    return {
      success: true,
      message: `User ${email} created successfully`,
      user: userData.user,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Failed to create user" };
  }
}

// Example usage for testing:
// createTestUser("test@example.com", "password123", "Test User")
