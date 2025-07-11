'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { CalendarIcon, XIcon } from 'lucide-react'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { useLocationContext } from '@/context/LocationContext'
import { useGeocodedCoordinates } from '@/hooks/useGeocodedCoordinates'
import { useCurrentLocation } from '@/hooks/useCurrentLocation'
import ManualAddressInput from '@/components/forms/manualAddressInput/ManualAddressInput'
import { MainAddress } from '@/types/supabase-fixed'
import { getCoordinatesFromAddress } from '@/lib/googleMaps/location'

export function FilterForm({
  className,
  onOpenChange,
  userMainAddress,
  open,
}: {
  className?: string
  onOpenChange: ((open: boolean) => void) | undefined
  userMainAddress?: MainAddress
  open: boolean
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { distanceType, setDistanceType, manualAddress } = useLocationContext()

  const [maxDistance, setMaxDistance] = useState(
    searchParams.get('distance') || '',
  )
  const [fromDate, setFromDate] = useState<Date | undefined>(
    searchParams.get('fromDate')
      ? new Date(searchParams.get('fromDate')!)
      : undefined,
  )
  const [toDate, setToDate] = useState<Date | undefined>(
    searchParams.get('toDate')
      ? new Date(searchParams.get('toDate')!)
      : undefined,
  )

  const { data: manualCoords } = useGeocodedCoordinates(
    manualAddress,
    distanceType === 'manual',
  )
  const { data: geoCoords } = useCurrentLocation(distanceType === 'geo')

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
    let coords: { lat: number; lng: number } | undefined

    if (distanceType === 'manual') coords = manualCoords || undefined
    if (distanceType === 'geo') coords = geoCoords || undefined
    if (distanceType === 'profile' && userMainAddress) {
      const fetched = await getCoordinatesFromAddress(
        `${userMainAddress.street_name} ${userMainAddress.street_number}, ${userMainAddress.city}, ${userMainAddress.country}`,
      )
      if (fetched) coords = fetched
    }

    updateUrlParams({
      distance: maxDistance || undefined,
      fromDate: fromDate?.toISOString().split('T')[0],
      toDate: toDate?.toISOString().split('T')[0],
      lat: coords ? coords.lat.toString() : undefined,
      lng: coords ? coords.lng.toString() : undefined,
    })

    if (open) onOpenChange?.(false)
  }

  const handleReset = () => {
    updateUrlParams({
      distance: undefined,
      fromDate: undefined,
      toDate: undefined,
      lat: undefined,
      lng: undefined,
    })
    setMaxDistance('')
    setFromDate(undefined)
    setToDate(undefined)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('grid gap-6', className)}
    >
      {/* מרחק */}
      <div className="grid gap-2">
        <Label htmlFor="maxDistance">מרחק מקסימלי (ק״מ)</Label>
        <Input
          id="maxDistance"
          type="number"
          placeholder="לדוג׳ 10"
          value={maxDistance}
          onChange={(e) => setMaxDistance(e.target.value)}
        />
      </div>

      {/* מקור מיקום */}
      <div className="grid gap-2">
        <Label>מקור מיקום</Label>
        <Select
          value={distanceType}
          onValueChange={(value) =>
            setDistanceType(value as 'manual' | 'geo' | 'profile')
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="בחר מקור מיקום" />
          </SelectTrigger>
          <SelectContent>
            {userMainAddress && (
              <SelectItem value="profile">
                כתובת ראשית:{' '}
                {`${userMainAddress.street_name} ${userMainAddress.street_number}, ${userMainAddress.city}`}
              </SelectItem>
            )}
            <SelectItem value="manual">כתובת ידנית</SelectItem>
            {/* <SelectItem value="geo">מיקום נוכחי</SelectItem> */}
          </SelectContent>
        </Select>
        {distanceType === 'manual' && <ManualAddressInput />}
      </div>

      {/* טווח תאריכים */}
      <div className="grid gap-2">
        <Label>טווח תאריכי פרסום</Label>
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate
                  ? format(fromDate, 'dd/MM/yyyy', { locale: he })
                  : 'מתאריך'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
                locale={he}
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate
                  ? format(toDate, 'dd/MM/yyyy', { locale: he })
                  : 'עד תאריך'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                locale={he}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Button type="submit">החל סינון</Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
        >
          <XIcon className="mr-2 h-4 w-4" /> איפוס
        </Button>
      </div>
    </form>
  )
}
