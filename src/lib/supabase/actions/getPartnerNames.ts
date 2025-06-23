"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function getPartnerNames(
  partnerIds: string[]
): Promise<Record<string, string> | undefined> {
  try {
    if (!partnerIds || partnerIds.length === 0) {
      throw new Error("No partner IDs provided.");
    }
    // Fetch user metadata for the provided partner IDs
    const partnerNames = [];

    for (const id of partnerIds) {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);
      if (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        continue; // Skip this ID if there's an error
      }
      if (data.user.user_metadata.full_name) {
        partnerNames.push({
          id: data.user.id,
          full_name: data.user.user_metadata.full_name,
        });
      } else {
        console.warn(`No full_name found for user ID ${id}`);
      }
    }

    // Convert the array to a map for easier access
    const partnerNamesMap: Record<string, string> = {};
    partnerNames.forEach((user) => {
      partnerNamesMap[user.id] = user.full_name;
    });

    return partnerNamesMap;
  } catch (error) {
    console.error(error);
  }
}
