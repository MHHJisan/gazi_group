"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAccounts() {
  try {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching accounts:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch accounts",
      };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch accounts",
    };
  }
}

export async function createAccount(
  name: string,
  type: string,
  accountNumber?: string,
  bankName?: string,
  balance?: string,
  currency: string = "USD",
  description?: string,
) {
  try {
    const { data, error } = await supabase
      .from("accounts")
      .insert({
        name,
        type,
        account_number: accountNumber || null,
        bank_name: bankName || null,
        balance: balance || "0",
        currency,
        description: description || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating account:", error);
      return {
        success: false,
        error: error.message || "Failed to create account",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error creating account:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create account",
    };
  }
}

export async function updateAccountAction(
  id: number,
  name: string,
  type: string,
  accountNumber?: string,
  bankName?: string,
  balance?: string,
  currency: string = "USD",
  isActive?: boolean,
  description?: string,
) {
  try {
    const { data, error } = await supabase
      .from("accounts")
      .update({
        name,
        type,
        account_number: accountNumber || null,
        bank_name: bankName || null,
        balance: balance || "0",
        currency,
        is_active: isActive !== undefined ? isActive : true,
        description: description || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating account:", error);
      return {
        success: false,
        error: error.message || "Failed to update account",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating account:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update account",
    };
  }
}

export async function deleteAccountAction(id: number) {
  try {
    const { error } = await supabase.from("accounts").delete().eq("id", id);

    if (error) {
      console.error("Error deleting account:", error);
      return {
        success: false,
        error: error.message || "Failed to delete account",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete account",
    };
  }
}
