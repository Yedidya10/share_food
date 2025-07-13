import { useQuery } from '@tanstack/react-query'

export function useCurrentLocation() {
  return useQuery({
    queryKey: ['currentLocation'],
    queryFn: () =>
      new Promise<{ lat: number; lng: number; accuracy: number }>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              resolve({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
              }),
            reject,
          )
        },
      ),
    enabled: false, // לא רץ אוטומטית
    staleTime: 1000 * 60 * 5,
  })
}
