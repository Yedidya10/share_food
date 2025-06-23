"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteUser(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.admin.deleteUser(userId, true);

    if (error) {
      console.error("Error deleting user:", error);
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error(error);
  }
}
