import { useQuery } from '@tanstack/react-query'
import { searchCitiesInHebrew } from '@/lib/supabase/actions/locations'

export function useCities(search: string) {
  return useQuery({
    queryKey: ['cities', search],
    queryFn: () => searchCitiesInHebrew(search),
    enabled: search.length >= 2,
  })
}
