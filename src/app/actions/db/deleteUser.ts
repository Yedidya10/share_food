"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteUser(userId: string) {
  const supabase = await createClient();

  if (!userId) {
    throw new Error("User ID is required.");
  }

  const { data, error } = await supabase.auth.admin.deleteUser(userId, true);

  if (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user.");
  }

  return { message: "User deleted successfully.", user: data.user };
}
