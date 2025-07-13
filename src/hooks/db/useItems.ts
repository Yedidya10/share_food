import { useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useMemo } from 'react'

type Coords = { lat: number; lng: number }

export type UseInfiniteItemsOptions = {
  userCoords?: Coords
  sortBy?: 'distance' | 'date' | 'community' // 👈 הוספנו גם community
  category?: string[]
  search?: string
  maxDistanceKm?: number
  fromDate?: Date
  toDate?: Date
  excludeUserId?: string
  includeUserId?: string
  status?: string[]
  pageSize?: number
  communityIds?: string[] // 👈 חדש
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
    communityIds, // 👈 חדש
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
        communityIds, // 👈 חדש
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
      communityIds, // 👈 חדש
    ],
  )

  const shouldUseDistance =
    (sortBy === 'distance' || sortBy === 'community') && userCoords

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const supabase = createClient()

      const { data, error } = await supabase.rpc('get_items_nearby', {
        sort_by: sortBy,
        category_filter: category?.length ? category : undefined,
        status_filter: status?.length ? status : undefined,
        search_term: search ?? undefined,
        max_distance_km: maxDistanceKm ?? undefined,
        from_date: fromDate ? fromDate.toISOString() : undefined,
        to_date: toDate ? toDate.toISOString() : undefined,
        include_user_id: includeUserId ?? undefined,
        exclude_user_id: excludeUserId ?? undefined,
        community_ids: communityIds?.length ? communityIds : undefined, // 👈 חדש
        limit_count: pageSize,
        offset_count: pageParam,
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
