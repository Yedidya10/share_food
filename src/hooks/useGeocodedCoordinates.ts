// src/hooks/useGeocodedCoordinates.ts
import { useQuery } from '@tanstack/react-query'
import { getCoordinatesFromAddress } from '@/lib/googleMaps/location'

export function useGeocodedCoordinates(address: string, enabled: boolean) {
  return useQuery({
    queryKey: ['geocode', address],
    queryFn: () => getCoordinatesFromAddress(address),
    enabled: enabled && !!address,
    staleTime: 1000 * 60 * 10, // 10 דקות קאש
  })
}
