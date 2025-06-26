import { googleConfig } from '../envConfig'

export async function getCoordinatesFromAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleConfig.mapsApiKey}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.status === 'OK') {
    const location = data.results[0].geometry.location
    return { lat: location.lat, lng: location.lng }
  }

  return null
}

export async function getDistanceInKm({
  from,
  to,
}: {
  from: string
  to: string
}): Promise<number | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(from)}&destinations=${encodeURIComponent(to)}&units=metric&key=${apiKey}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.status === 'OK' && data.rows[0]?.elements[0]?.status === 'OK') {
    const meters = data.rows[0].elements[0].distance.value
    return meters / 1000
  }

  return null
}
