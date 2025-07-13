'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useLocationContext } from '@/context/LocationContext'
import { useGeocodedCoordinates } from '@/hooks/useGeocodedCoordinates'
import { useState } from 'react'
import { MainAddress } from '@/types/supabase-fixed'
import { getCoordinatesFromAddress } from '@/lib/googleMaps/location'
import LocationSourceSelector from '../locationSourceSelector/LocationSourceSelector'

export function SortForm({
  userMainAddress,
}: {
  userMainAddress?: MainAddress
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { distanceType, setDistanceType, manualAddress } = useLocationContext()
  const [geoLocation, setGeoLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [sortBy, setSortBy] = useState(searchParams.get('sort') ?? 'date')

  // hooks שמחזירים coords בהתאם לבחירה
  const { data: manualCoords } = useGeocodedCoordinates(
    manualAddress,
    distanceType === 'manual',
  )

  // פונקציה שמעדכנת את כתובת ה-URL
  const updateUrlParams = (params: Record<string, string | undefined>) => {
    const current = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) current.set(key, value)
      else current.delete(key)
    })
    current.set('page', '0')
    router.replace('?' + current.toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (sortBy === 'distance') {
      let coords: { lat: number; lng: number } | null | undefined = null

      if (distanceType === 'manual') coords = manualCoords || undefined
      if (distanceType === 'geo') coords = geoLocation || undefined
      if (distanceType === 'profile' && userMainAddress) {
        coords = await getCoordinatesFromAddress(
          `${userMainAddress.street_name} ${userMainAddress.street_number}, ${userMainAddress.city}, ${userMainAddress.country}`,
        )
      }

      if (coords) {
        updateUrlParams({
          sort: 'distance',
          lat: coords.lat.toString(),
          lng: coords.lng.toString(),
        })
      }
    } else {
      updateUrlParams({
        sort: 'date',
        lat: undefined,
        lng: undefined,
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <Label>מיין לפי</Label>
        <Select
          value={sortBy}
          onValueChange={setSortBy}
        >
          <SelectTrigger>
            <SelectValue placeholder="בחר מיון" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">תאריך פרסום (ברירת מחדל)</SelectItem>
            <SelectItem value="distance">מרחק ממני</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortBy === 'distance' && (
        <LocationSourceSelector
          userMainAddress={userMainAddress}
          setDistanceType={setDistanceType}
          distanceType={distanceType}
          setGeoLocation={setGeoLocation}
        />
      )}

      <Button
        type="submit"
        className="mt-2"
      >
        החל מיון
      </Button>
    </form>
  )
}
