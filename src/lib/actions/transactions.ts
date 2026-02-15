"use server";

import { queryTransactions, insertTransaction } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

export interface TransactionData {
  description: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
  entityId: number;
  unitId?: number | null;
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
    });

    // Revalidate the transactions page to show the new transaction
    revalidatePath("/transactions");

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
      entityId ? { entity_id: entityId } : undefined
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
