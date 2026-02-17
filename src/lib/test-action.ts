"use server";

import { redirect } from "next/navigation";

export async function testAction(formData: FormData) {
  console.log("Test action called with:", formData);
  redirect("/login?message=Test action worked");
}
