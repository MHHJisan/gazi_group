import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { email, password } = await request.json();

    console.log("API login attempt:", { email, password: "***" });

    // First try Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (!authError && authData.session) {
      console.log("API login successful via Supabase Auth");

      // Set the session cookies manually
      const response = NextResponse.json(
        { success: true, message: "Login successful" },
        { status: 200 },
      );

      const cookieStore = await cookies();

      // Set access token cookie
      response.cookies.set("sb-access-token", authData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      // Set refresh token cookie
      if (authData.session.refresh_token) {
        response.cookies.set(
          "sb-refresh-token",
          authData.session.refresh_token,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
          },
        );
      }

      return response;
    }

    // If Supabase Auth fails, try custom users table
    console.log("Supabase Auth failed, trying custom users table");

    // Create a direct Supabase client to query the users table
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const directClient = createSupabaseClient(supabaseUrl, supabaseKey);

    console.log(`🔍 Looking for user with email: ${email}`);

    const { data: userData, error: userError } = await directClient
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError) {
      console.log(`❌ User lookup error:`, userError.message);
      console.error("API login error: Invalid credentials");
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 400 },
      );
    }

    if (!userData) {
      console.log(`❌ No user found with email: ${email}`);
      console.error("API login error: Invalid credentials");
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 400 },
      );
    }

    console.log(`✅ User found: ${userData.name}, checking password...`);
    console.log(`🔐 Stored password: ${userData.password}`);
    console.log(`🔐 Provided password: ${password}`);

    if (userData.password !== password) {
      console.log(`❌ Password mismatch for user: ${email}`);
      console.error("API login error: Invalid credentials");
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 400 },
      );
    }

    console.log("API login successful via custom users table");

    // Create a custom session for users table authentication
    const customSession = {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
      },
      customAuth: true,
    };

    const response = NextResponse.json(
      { success: true, message: "Login successful", user: customSession.user },
      { status: 200 },
    );

    // Set custom session cookie
    response.cookies.set("custom-session", JSON.stringify(customSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("API login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
