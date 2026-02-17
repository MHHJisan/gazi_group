// app/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  // We use getUser() because it's more secure and
  // talks to the Supabase API to verify the token.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If there's an error or no user, they ARE NOT logged in
  if (error || !user) {
    redirect("/login");
  }

  // If we reach here, they ARE logged in
  redirect("/dashboard");
}
