import { useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useMemo } from 'react'

type Coords = { lat: number; lng: number }

export type UseInfiniteItemsOptions = {
  userCoords?: Coords
  sortBy?: 'distance' | 'date'
  category?: string[]
  search?: string
  maxDistanceKm?: number
  fromDate?: Date
  toDate?: Date
  excludeUserId?: string
  includeUserId?: string
  status?: string[]
  pageSize?: number
}

export default function useItems(options: UseInfiniteItemsOptions = {}) {
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

  const queryKey = useMemo(
    () => [
      'items',
      {
        sortBy,
        category,
        search,
        maxDistanceKm,
        fromDate: fromDate?.toISOString(),
        toDate: toDate?.toISOString(),
        excludeUserId,
        includeUserId,
        status,
        lat: userCoords?.lat,
        lng: userCoords?.lng,
      },
    ],
    [
      sortBy,
      category,
      search,
      maxDistanceKm,
      fromDate,
      toDate,
      excludeUserId,
      includeUserId,
      status,
      userCoords?.lat,
      userCoords?.lng,
    ],
  )

  const shouldUseDistance = sortBy === 'distance' && userCoords

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const supabase = createClient()

      const { data, error } = await supabase.rpc('get_items_nearby', {
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
        offset_count: pageParam,
        // רק אם צריך לחשב מרחק:
        ...(shouldUseDistance && {
          user_lat: userCoords!.lat,
          user_lng: userCoords!.lng,
        }),
      })

      if (error) {
        console.error('Error fetching items:', error)
        throw new Error(error.message)
      }

      return data ?? []
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < pageSize) return undefined
      return allPages.flat().length
    },
    initialPageParam: 0,
  })
}
