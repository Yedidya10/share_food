// src/hooks/useCurrentLocation.ts
import { useQuery } from '@tanstack/react-query'

export function useCurrentLocation(enabled: boolean) {
  return useQuery({
    queryKey: ['currentLocation'],
    queryFn: () =>
      new Promise<{ lat: number; lng: number }>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          reject,
        )
      }),
    enabled,
    staleTime: 1000 * 60 * 5,
  })
}
