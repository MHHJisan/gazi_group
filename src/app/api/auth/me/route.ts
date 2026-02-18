import { NextRequest, NextResponse } from "next/server";
import { getCustomUser } from "@/utils/supabase/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    // Check Supabase Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      return NextResponse.json({ 
        authenticated: true, 
        user: { id: user.id, email: user.email, name: user.user_metadata?.name || user.email },
        authMethod: "supabase"
      });
    }

    // Check custom session
    const customUser = await getCustomUser();
    
    if (customUser) {
      return NextResponse.json({ 
        authenticated: true, 
        user: customUser,
        authMethod: "custom"
      });
    }

    return NextResponse.json({ 
      authenticated: false, 
      user: null 
    });

  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ 
      authenticated: false, 
      user: null 
    });
  }
}
