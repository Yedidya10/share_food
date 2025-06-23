import { createClient } from "@/lib/supabase/server";
import { UseInfiniteItemsOptions } from "@/hooks/db/useItems";

export async function getItemsNearby(
  options: UseInfiniteItemsOptions = {},
  offset = 0
) {
  const {
    userCoords,
    sortBy = "date",
    category,
    search,
    maxDistanceKm,
    fromDate,
    toDate,
    excludeUserId,
    includeUserId,
    status,
    pageSize = 20,
  } = options;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_items_nearby", {
    sort_by: sortBy,
    category_filter: category?.length ? category : null,
    status_filter: status?.length ? status : null,
    search_term: search ?? null,
    max_distance_km: maxDistanceKm ?? null,
    from_date: fromDate ?? null,
    to_date: toDate ?? null,
    include_user_id: includeUserId ?? null,
    exclude_user_id: excludeUserId ?? null,
    limit_count: pageSize,
    offset_count: offset,
    ...(sortBy === "distance" && userCoords
      ? {
          user_lat: userCoords.lat,
          user_lng: userCoords.lng,
        }
      : {}),
  });

  if (error) {
    console.error("getItemsNearby error:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}
