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
  const rpcParams: {
    sort_by: string
    category_filter: string[] | null
    status_filter: string[] | null
    search_term: string | null
    max_distance_km: number | null
    from_date: string | null
    to_date: string | null
    include_user_id: string | null
    exclude_user_id: string | null
    limit_count: number
    offset_count: number
    user_lat?: number
    user_lng?: number
  } = {
    sort_by: sortBy,
    category_filter: category?.length ? category : null,
    status_filter: status?.length ? status : null,
    search_term: search ?? null,
    max_distance_km: maxDistanceKm ?? null,
    from_date: fromDate
      ? typeof fromDate === 'string'
        ? fromDate
        : fromDate.toISOString()
      : null,
    to_date: toDate
      ? typeof toDate === 'string'
        ? toDate
        : toDate.toISOString()
      : null,
    include_user_id: includeUserId ?? null,
    exclude_user_id: excludeUserId ?? null,
    limit_count: pageSize,
    offset_count: offset,
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
