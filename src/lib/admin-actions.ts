// lib/admin-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createTestUser(
  email: string,
  password: string,
  name?: string,
) {
  const supabase = createClient();

  try {
    // Create user in Supabase Auth using regular signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      },
    });

    if (error) {
      console.error("Error creating user:", error);
      return { success: false, error: error.message };
    }

    // Create user profile in users table
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        name: name || email.split("@")[0],
        role: "user",
        status: "active",
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        return {
          success: false,
          error: "User created in auth but profile creation failed",
        };
      }
    }

    return {
      success: true,
      message: `User ${email} created successfully`,
      user: data.user,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Failed to create user" };
  }
}

// Example usage for testing:
// createTestUser("test@example.com", "password123", "Test User")
