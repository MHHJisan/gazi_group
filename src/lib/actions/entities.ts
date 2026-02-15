"use server";

import {
  queryEntities,
  insertEntity,
  updateEntity,
  deleteEntity,
} from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

export async function getEntities(ownerId: number = 1) {
  try {
    const result = await queryEntities({ owner_id: ownerId });
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching entities:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch entities",
    };
  }
}

export async function createEntity(
  name: string,
  type: "BUSINESS" | "PROPERTY",
  address?: string,
  ownerId: number = 1,
) {
  try {
    // Try to create with address first
    const entityData: any = {
      name,
      type,
      owner_id: ownerId,
    };

    // Only add address if provided
    if (address) {
      entityData.address = address;
    }

    const entity = await insertEntity(entityData);
    revalidatePath("/entities");
    return { success: true, data: entity };
  } catch (error: any) {
    // If error is about address column not existing, try without it
    if (error.message?.includes("address") || error.code === "PGRST204") {
      console.log(
        "Address column not found, creating entity without address...",
      );
      try {
        const entity = await insertEntity({
          name,
          type,
          owner_id: ownerId,
        });
        revalidatePath("/entities");
        return { success: true, data: entity };
      } catch (fallbackError) {
        console.error("Error creating entity without address:", fallbackError);
        return {
          success: false,
          error:
            fallbackError instanceof Error
              ? fallbackError.message
              : "Failed to create entity",
        };
      }
    }

    console.error("Error creating entity:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create entity",
    };
  }
}

export async function updateEntityAction(
  id: number,
  name: string,
  type: "BUSINESS" | "PROPERTY",
  address?: string,
) {
  try {
    // Try to update with address first
    const updateData: any = {
      name,
      type,
    };

    // Only add address if provided
    if (address) {
      updateData.address = address;
    }

    const entity = await updateEntity(id, updateData);
    revalidatePath("/entities");
    return { success: true, data: entity };
  } catch (error: any) {
    // If error is about address column not existing, try without it
    if (error.message?.includes("address") || error.code === "PGRST204") {
      console.log(
        "Address column not found, updating entity without address...",
      );
      try {
        const entity = await updateEntity(id, {
          name,
          type,
        });
        revalidatePath("/entities");
        return { success: true, data: entity };
      } catch (fallbackError) {
        console.error("Error updating entity without address:", fallbackError);
        return {
          success: false,
          error:
            fallbackError instanceof Error
              ? fallbackError.message
              : "Failed to update entity",
        };
      }
    }

    console.error("Error updating entity:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update entity",
    };
  }
}

export async function deleteEntityAction(id: number) {
  try {
    await deleteEntity(id);
    revalidatePath("/entities");
    return { success: true };
  } catch (error) {
    console.error("Error deleting entity:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete entity",
    };
  }
}
