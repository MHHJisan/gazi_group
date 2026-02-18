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
  // First try Supabase Auth
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user) {
    return user;
  }

  // If Supabase Auth fails, check for custom session
  const customSession = document.cookie
    .split("; ")
    .find((cookie) => cookie.trim().startsWith("custom-session="))
    ?.split("=")[1];

  if (!customSession) {
    return null;
  }

  try {
    const session = JSON.parse(decodeURIComponent(customSession));
    return session.user;
  } catch {
    return null;
  }
}
