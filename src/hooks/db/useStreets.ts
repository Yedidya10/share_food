import { useQuery } from '@tanstack/react-query'
import { searchStreetsInHebrew } from '@/lib/supabase/actions/locations'

export function useStreets(search: string, city: string) {
  return useQuery({
    queryKey: ['streets', search, city],
    queryFn: () => searchStreetsInHebrew(search, city),
    enabled: search.length >= 2 && !!city,
  })
}
