"use server";

import { createClient } from "@/lib/supabase/server";

export async function getItemById(itemId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("active_items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (error) {
    console.error("Error fetching item by ID:", error);
    return null;
  }

  return data;
}
