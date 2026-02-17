import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL:", supabaseUrl);
  console.error("Supabase Key:", supabaseKey ? "SET" : "MISSING");
  throw new Error("Missing Supabase URL or Key");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions
export type Entity = {
  id: number;
  name: string;
  type: "BUSINESS" | "PROPERTY";
  address?: string | null;
  owner_id: number;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: number;
  entity_id: number;
  unit_id?: number | null;
  account_id?: number | null;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
  description?: string | null;
  recipient?: string | null;
  created_at: string;
  updated_at: string;
};

export type Unit = {
  id: number;
  entity_id: number;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

// Query functions
export async function queryEntities(filter?: { owner_id?: number }) {
  let query = supabase.from("entities").select("*");

  if (filter?.owner_id !== undefined) {
    query = query.eq("owner_id", filter.owner_id);
  }

  const { data, error } = await query.order("name");

  if (error) throw error;
  return data as Entity[];
}

export async function queryTransactions(filter?: { entity_id?: number }) {
  let query = supabase.from("transactions").select("*");

  if (filter?.entity_id !== undefined) {
    query = query.eq("entity_id", filter.entity_id);
  }

  const { data, error } = await query.order("date", { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

export async function insertEntity(
  entity: Omit<Entity, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("entities")
    .insert([entity])
    .select();

  if (error) throw error;
  return data?.[0] as Entity;
}

export async function insertTransaction(
  transaction: Omit<Transaction, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("transactions")
    .insert([transaction])
    .select();

  if (error) throw error;
  return data?.[0] as Transaction;
}
export async function updateEntity(
  id: number,
  entity: Partial<Omit<Entity, "id" | "created_at" | "updated_at">>,
) {
  const { data, error } = await supabase
    .from("entities")
    .update(entity)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data?.[0] as Entity;
}

export async function deleteEntity(id: number) {
  const { error } = await supabase.from("entities").delete().eq("id", id);

  if (error) throw error;
  return true;
}
