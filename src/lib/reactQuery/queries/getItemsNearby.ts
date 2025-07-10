import { createClient } from '@/lib/supabase/server'
import { UseInfiniteItemsOptions } from '@/hooks/db/useItems'

export async function getItemsNearby(
  options: UseInfiniteItemsOptions = {},
  offset = 0,
) {
  const {
    userCoords,
    sortBy = 'date',
    category,
    search,
    maxDistanceKm,
    fromDate,
    toDate,
    excludeUserId,
    includeUserId,
    status,
    pageSize = 20,
  } = options

  const supabase = await createClient()

  // Use a more specific type for rpcParams
  const rpcParams = {
    sort_by: sortBy,
    category_filter: category?.length ? category : undefined,
    status_filter: status?.length ? status : undefined,
    search_term: search ?? undefined,
    max_distance_km: maxDistanceKm ?? undefined,
    from_date: fromDate
      ? typeof fromDate === 'string'
        ? fromDate
        : fromDate.toISOString()
      : undefined,
    to_date: toDate
      ? typeof toDate === 'string'
        ? toDate
        : toDate.toISOString()
      : undefined,
    include_user_id: includeUserId ?? undefined,
    exclude_user_id: excludeUserId ?? undefined,
    limit_count: pageSize,
    offset_count: offset,
    user_lat: undefined as number | undefined,
    user_lng: undefined as number | undefined,
  }

  if (sortBy === 'distance') {
    if (
      !userCoords ||
      typeof userCoords.lat !== 'number' ||
      typeof userCoords.lng !== 'number'
    ) {
      throw new Error(
        "userCoords with both lat and lng must be provided when sortBy is 'distance'.",
      )
    }
    rpcParams.user_lat = userCoords.lat
    rpcParams.user_lng = userCoords.lng
  }

  const { data, error } = await supabase.rpc('get_items_nearby', rpcParams)

  if (error) {
    console.error('getItemsNearby error:', error)
    throw new Error(error.message)
  }

  return data ?? []
}
