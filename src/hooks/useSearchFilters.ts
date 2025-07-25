'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'

export function useSearchFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const getParam = (key: string) => searchParams.get(key)

  const setParams = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (!value) newParams.delete(key)
      else newParams.set(key, value)
    })

    router.replace(`?${newParams.toString()}`)
  }

  const lat = getParam('lat')
  const lng = getParam('lng')

  const coords =
    lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined

  const categoriesParam = getParam('categories')
  const categories = categoriesParam
    ? categoriesParam.split(',').filter(Boolean)
    : undefined

  return {
    // ערכים מוכנים להוקי נתונים:
    filters: {
      userCoords: coords,
      search: getParam('search') ?? undefined,
      sortBy: (searchParams.get('sort') === 'distance'
        ? 'distance'
        : 'date') as 'distance' | 'date',
      maxDistanceKm: getParam('distance')
        ? parseFloat(getParam('distance')!)
        : undefined,
      categories,
      fromDate: getParam('fromDate')
        ? new Date(getParam('fromDate')!)
        : undefined,
      toDate: getParam('toDate') ? new Date(getParam('toDate')!) : undefined,
      pageSize: 10,
    },

    // שליטה על פרמטרים:
    getParam,
    setParams,
    rawSearchParams: searchParams,
  }
}
