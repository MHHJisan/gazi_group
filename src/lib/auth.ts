import { createClient } from "@/utils/supabase/server";
import { getCustomUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  
  // Check for Supabase Auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check for custom authenticated user
  const customUser = await getCustomUser();

  // If neither authentication method works, redirect to login
  if (!user && !customUser) {
    redirect("/login");
  }

  // Use the authenticated user (prefer Supabase Auth, fallback to custom)
  return user || customUser;
}
