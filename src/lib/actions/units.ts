"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getUnits(entityId?: number) {
  try {
    let query = supabase.from("units").select("*");

    if (entityId) {
      query = query.eq("entity_id", entityId);
    }

    const { data, error } = await query.order("name");

    if (error) {
      console.error("Error fetching units:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch units",
      };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error fetching units:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch units",
    };
  }
}

export async function createUnit(
  entityId: number,
  name: string,
  description?: string,
) {
  try {
    const { data, error } = await supabase
      .from("units")
      .insert({
        entity_id: entityId,
        name,
        description: description || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating unit:", error);
      return {
        success: false,
        error: error.message || "Failed to create unit",
      };
    }

    revalidatePath("/entities");
    return { success: true, data };
  } catch (error) {
    console.error("Error creating unit:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create unit",
    };
  }
}

export async function updateUnitAction(
  id: number,
  name: string,
  description?: string,
) {
  try {
    const { data, error } = await supabase
      .from("units")
      .update({
        name,
        description: description || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating unit:", error);
      return {
        success: false,
        error: error.message || "Failed to update unit",
      };
    }

    revalidatePath("/entities");
    return { success: true, data };
  } catch (error) {
    console.error("Error updating unit:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update unit",
    };
  }
}

export async function deleteUnitAction(id: number) {
  try {
    const { error } = await supabase.from("units").delete().eq("id", id);

    if (error) {
      console.error("Error deleting unit:", error);
      return {
        success: false,
        error: error.message || "Failed to delete unit",
      };
    }

    revalidatePath("/entities");
    return { success: true };
  } catch (error) {
    console.error("Error deleting unit:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete unit",
    };
  }
}
