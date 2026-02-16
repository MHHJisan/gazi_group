"use server";

import {
  queryTransactions,
  insertTransaction,
  supabase,
  Transaction,
} from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

export interface TransactionData {
  description: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
  entityId: number;
  unitId?: number | null;
  recipient?: string | null;
  accountId?: number | null;
}

export async function createTransaction(data: TransactionData) {
  try {
    // Convert amount from string to decimal
    const amount = parseFloat(data.amount);

    if (isNaN(amount)) {
      throw new Error("Invalid amount format");
    }

    // Convert date string to Date object
    const transactionDate = new Date(data.date);

    if (isNaN(transactionDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const newTransaction = await insertTransaction({
      description: data.description,
      amount: amount.toString(),
      type: data.type,
      category: data.category,
      date: transactionDate.toISOString(),
      entity_id: data.entityId,
      unit_id: data.unitId || null,
      recipient: data.recipient || null,
      account_id: data.accountId || null,
    });

    // Update account balance if account is specified
    if (data.accountId && newTransaction) {
      try {
        // Get current account details
        const { data: accountData, error: accountError } = await supabase
          .from("accounts")
          .select("balance")
          .eq("id", data.accountId)
          .single();

        if (accountError) {
          console.error("Error fetching account:", accountError);
        } else if (accountData) {
          const currentBalance = parseFloat(accountData.balance);
          const transactionAmount = parseFloat(data.amount);

          // Calculate new balance
          let newBalance;
          if (data.type === "INCOME") {
            newBalance = currentBalance + transactionAmount;
          } else {
            newBalance = currentBalance - transactionAmount;
          }

          // Update account balance
          const { error: updateError } = await supabase
            .from("accounts")
            .update({ balance: newBalance.toString() })
            .eq("id", data.accountId);

          if (updateError) {
            console.error("Error updating account balance:", updateError);
          } else {
            console.log("Account balance updated successfully");
          }
        }
      } catch (accountError) {
        console.error("Error updating account balance:", accountError);
        // Continue even if account update fails
      }
    }

    // Revalidate pages to show updated data
    revalidatePath("/transactions");
    revalidatePath("/accounts");

    return { success: true, data: newTransaction };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create transaction",
    };
  }
}

export async function getTransactions(entityId?: number) {
  try {
    const result = await queryTransactions(
      entityId ? { entity_id: entityId } : undefined,
    );

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch transactions",
    };
  }
}

export async function deleteTransactionAction(id: number) {
  try {
    // Get transaction details before deletion to update account balance
    const { data: transactionData, error: fetchError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching transaction:", fetchError);
      return {
        success: false,
        error: fetchError.message || "Failed to fetch transaction",
      };
    }

    // Delete the transaction
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting transaction:", error);
      return {
        success: false,
        error: error.message || "Failed to delete transaction",
      };
    }

    // Update account balance if account was specified
    if (transactionData?.account_id && transactionData) {
      try {
        // Get current account balance
        const { data: accountData, error: accountError } = await supabase
          .from("accounts")
          .select("balance")
          .eq("id", transactionData.account_id)
          .single();

        if (accountError) {
          console.error(
            "Error fetching account for balance update:",
            accountError,
          );
        } else if (accountData) {
          const currentBalance = parseFloat(accountData.balance);
          const transactionAmount = parseFloat(transactionData.amount);

          // Reverse the transaction effect on balance
          let newBalance;
          if (transactionData.type === "INCOME") {
            newBalance = currentBalance - transactionAmount; // Reverse income
          } else {
            newBalance = currentBalance + transactionAmount; // Reverse expense
          }

          // Update account balance
          const { error: updateError } = await supabase
            .from("accounts")
            .update({ balance: newBalance.toString() })
            .eq("id", transactionData.account_id);

          if (updateError) {
            console.error(
              "Error updating account balance on delete:",
              updateError,
            );
          } else {
            console.log(
              "Account balance updated successfully on transaction delete",
            );
          }
        }
      } catch (accountError) {
        console.error(
          "Error updating account balance on delete:",
          accountError,
        );
      }
    }

    revalidatePath("/transactions");
    revalidatePath("/accounts");
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete transaction",
    };
  }
}

export async function updateTransactionAction(
  id: number,
  data: Partial<Omit<Transaction, "id" | "created_at" | "updated_at">>,
) {
  try {
    const { data: updatedData, error } = await supabase
      .from("transactions")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating transaction:", error);
      return {
        success: false,
        error: error.message || "Failed to update transaction",
      };
    }

    // Handle account balance updates if needed
    // This is a simplified version - you can add the complex balance logic later
    if (data.account_id !== undefined) {
      console.log("Account balance update logic would go here");
    }

    revalidatePath("/transactions");
    revalidatePath("/accounts");
    return { success: true, data: updatedData };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update transaction",
    };
  }
}
