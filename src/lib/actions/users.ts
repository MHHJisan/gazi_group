import { supabase } from "@/lib/supabase-client";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "user";
  status: "active" | "inactive";
  phone?: string;
  phone_code?: string;
  department?: string;
  created_at: string;
  last_login?: string;
  password?: string; // For password updates
};

export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function createUser(userData: Omit<User, "id" | "created_at">) {
  try {
    console.log("Creating user with data:", userData);

    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Error creating user:", error);
      const errorMessage =
        error.message || error.details || JSON.stringify(error);
      return { success: false, error: errorMessage };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create user";
    return { success: false, error: errorMessage };
  }
}

export async function updateUser(id: string, data: Partial<User>) {
  try {
    // Remove password from data since it's handled by Supabase Auth
    const { password, ...userData } = data;

    const { error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: error ? null : userData };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  try {
    console.log("Attempting to delete user with ID:", id);

    const { error } = await supabase.from("users").delete().eq("id", id);

    console.log("Delete response:", { error, id });

    if (error) {
      console.error("Error deleting user:", error);
      const errorMessage =
        error.message || error.details || JSON.stringify(error);
      return { success: false, error: errorMessage };
    }

    console.log("User deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete user";
    return { success: false, error: errorMessage };
  }
}

export async function getUserById(id: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}
