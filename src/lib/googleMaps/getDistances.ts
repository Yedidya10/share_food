type LatLng = { lat: number; lng: number }

type GetDistanceInKmInput = {
  from: string | LatLng
  to: string | LatLng
}

export async function getDistanceInKm({
  from,
  to,
}: GetDistanceInKmInput): Promise<number | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    console.error('Missing GOOGLE_MAPS_API_KEY')
    return null
  }

  const formatLocation = (loc: string | LatLng): string => {
    if (typeof loc === 'string') return loc
    return `${loc.lat},${loc.lng}`
  }

  const origins = formatLocation(from)
  const destinations = formatLocation(to)

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origins,
  )}&destinations=${encodeURIComponent(destinations)}&units=metric&key=${apiKey}`

  try {
    const res = await fetch(url)
    const data = await res.json()

    const element = data?.rows?.[0]?.elements?.[0]
    if (data.status === 'OK' && element?.status === 'OK') {
      const distanceMeters = element.distance.value
      return distanceMeters / 1000
    }

    console.error('Google Distance Matrix API error:', data)
    return null
  } catch (err) {
    console.error('Failed to fetch distance:', err)
    return null
  }
}
