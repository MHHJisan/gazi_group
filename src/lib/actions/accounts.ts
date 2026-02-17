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

export async function transferMoney(
  fromAccountId: number,
  toAccountId: number,
  amount: string,
  description?: string,
) {
  try {
    // Get current account details
    const { data: fromAccount, error: fromError } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", fromAccountId)
      .single();

    const { data: toAccount, error: toError } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", toAccountId)
      .single();

    if (fromError || toError) {
      return {
        success: false,
        error: "Failed to fetch account details",
      };
    }

    if (!fromAccount || !toAccount) {
      return {
        success: false,
        error: "Account not found",
      };
    }

    // Check if accounts have same currency
    if (fromAccount.currency !== toAccount.currency) {
      return {
        success: false,
        error: "Cannot transfer between different currencies",
      };
    }

    // Check sufficient balance
    const transferAmount = parseFloat(amount);
    const currentBalance = parseFloat(fromAccount.balance || "0");

    if (currentBalance < transferAmount) {
      return {
        success: false,
        error: "Insufficient balance",
      };
    }

    // Perform transfer
    const newFromBalance = currentBalance - transferAmount;
    const newToBalance = parseFloat(toAccount.balance || "0") + transferAmount;

    // Update both accounts
    const { error: updateFromError } = await supabase
      .from("accounts")
      .update({
        balance: newFromBalance.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", fromAccountId);

    const { error: updateToError } = await supabase
      .from("accounts")
      .update({
        balance: newToBalance.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", toAccountId);

    if (updateFromError || updateToError) {
      return {
        success: false,
        error: "Failed to update account balances",
      };
    }

    // Create transfer records
    const { error: transactionError } = await supabase
      .from("transactions")
      .insert([
        {
          description: description || `Transfer to ${toAccount.name}`,
          amount: amount,
          type: "EXPENSE",
          category: "Transfer",
          date: new Date().toISOString().split("T")[0],
          entity_id: 1, // Default entity, you might want to make this configurable
          account_id: fromAccountId,
          recipient: toAccount.name,
        },
        {
          description: description || `Transfer from ${fromAccount.name}`,
          amount: amount,
          type: "INCOME",
          category: "Transfer",
          date: new Date().toISOString().split("T")[0],
          entity_id: 1, // Default entity, you might want to make this configurable
          account_id: toAccountId,
          recipient: fromAccount.name,
        },
      ]);

    if (transactionError) {
      console.error("Error creating transfer transactions:", transactionError);
      // Note: Account balances are already updated, so we don't rollback here
      // In a production app, you might want to implement proper transaction handling
    }

    return {
      success: true,
      data: {
        fromAccount: fromAccount.name,
        toAccount: toAccount.name,
        amount: transferAmount,
        currency: fromAccount.currency,
      },
    };
  } catch (error) {
    console.error("Error transferring money:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to transfer money",
    };
  }
}
