import { googleConfig } from '../envConfig'

export async function getCoordinatesFromAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleConfig.mapsApiKey}`

    const res = await fetch(url)
    const data = await res.json()

    if (data.status !== 'OK') {
      throw new Error(`Geocoding error: ${data.status}`)
    }

    const location = data.results[0].geometry.location
    return {
      lat: location.lat,
      lng: location.lng,
    }
  } catch (error) {
    console.error('Error fetching geocoding data:', error)
    return null
  }
}
