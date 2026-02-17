import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { email, password } = await request.json();

    console.log("API login attempt:", { email, password: "***" });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("API login error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("API login successful");

    // Get the session and set cookies manually
    if (data.session) {
      const response = NextResponse.json(
        { success: true, message: "Login successful" },
        { status: 200 },
      );

      // Set the session cookies manually
      const cookieStore = await cookies();

      // Set access token cookie
      response.cookies.set("sb-access-token", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      // Set refresh token cookie
      if (data.session.refresh_token) {
        response.cookies.set("sb-refresh-token", data.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax" as const,
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }

      return response;
    }

    return NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 },
    );
  } catch (error) {
    console.error("API login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
