"use server";

import { queryEntities, insertEntity } from "@/lib/supabase-client";

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
  ownerId: number = 1,
) {
  try {
    const entity = await insertEntity({
      name,
      type,
      owner_id: ownerId,
    });
    return { success: true, data: entity };
  } catch (error) {
    console.error("Error creating entity:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create entity",
    };
  }
}
