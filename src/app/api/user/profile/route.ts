import { NextRequest, NextResponse } from "next/server";
import { getCustomUser } from "@/utils/supabase/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    // Check Supabase Auth first
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email,
          phone: user.phone || "",
          role: "user", // Default role for Supabase Auth users
          department: "",
          phone_code: "+1",
        },
        authMethod: "supabase",
      });
    }

    // Check custom session
    const customUser = await getCustomUser();

    if (customUser) {
      // Get full user data from database
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const directClient = createSupabaseClient(supabaseUrl, supabaseKey);

      const { data: userData, error: userError } = await directClient
        .from("users")
        .select("*")
        .eq("id", customUser.id)
        .single();

      if (userError || !userData) {
        return NextResponse.json({
          success: false,
          error: "User data not found",
        });
      }

      return NextResponse.json({
        success: true,
        user: userData,
        authMethod: "custom",
      });
    }

    return NextResponse.json({
      success: false,
      error: "User not authenticated",
    });
  } catch (error) {
    console.error("Get user data error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { name, phone, phone_code, department } = await request.json();

    // Get current user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Update Supabase Auth user metadata
      const { error } = await supabase.auth.updateUser({
        data: { name },
        phone: phone,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
      });
    }

    // Check custom session
    const customUser = await getCustomUser();

    if (customUser) {
      // Update custom user in database
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const directClient = createSupabaseClient(supabaseUrl, supabaseKey);

      const { error } = await directClient
        .from("users")
        .update({ name, phone, phone_code, department })
        .eq("id", customUser.id);

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
      });
    }

    return NextResponse.json({
      success: false,
      error: "User not authenticated",
    });
  } catch (error) {
    console.error("Update user data error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}
