'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { LocateIcon, Loader2 } from 'lucide-react'
import ManualAddressInput from '@/components/forms/manualAddressInput/ManualAddressInput'
import { toast } from 'sonner'
import { useCurrentLocation } from '@/hooks/useCurrentLocation'

import { DistanceType } from '@/context/LocationContext'
import { MainAddress } from '@/types/supabase-fixed'

interface LocationSourceSelectorProps {
  userMainAddress?: MainAddress
  setDistanceType: (type: DistanceType) => void
  distanceType: DistanceType
  setGeoLocation: (location: { lat: number; lng: number } | null) => void
}

export default function LocationSourceSelector({
  userMainAddress,
  setDistanceType,
  distanceType,
  setGeoLocation,
}: LocationSourceSelectorProps) {
  // הקריאה למיקום מוכנה מראש אבל לא רצה עד שנבקש
  const { refetch, isFetching } = useCurrentLocation()

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('הדפדפן שלך לא תומך בזיהוי מיקום')
      return
    }

    try {
      const result = await refetch() // מריץ את queryFn ידנית
      if (result.error) {
        console.error(result.error)
        toast.error('שגיאה בזיהוי המיקום', {
          description: result.error.message,
        })
        return
      }

      const location = result.data

      if (!location) {
        toast.error('לא התקבל מיקום')
        return
      }

      if (location.accuracy < 1000) {
        setGeoLocation({ lat: location.lat, lng: location.lng })
        toast.success('מיקום זוהה בהצלחה', {
          description: `דיוק: ~${Math.round(location.accuracy) / 1000} ק"מ`,
        })
        // כאן תוכל לעדכן state / context עם location.lat & location.lng
      } else {
        toast.error('מיקום לא מספיק מדויק', {
          description: `דיוק זוהה: ~${Math.round(location.accuracy) / 1000} ק"מ. נסה להתחבר דרך הנייד או לבחור כתובת ידנית.`,
        })
      }
    } catch (error) {
      console.error(error)
      toast.error('שגיאה בזיהוי המיקום', {
        description: 'אנא נסה שוב מאוחר יותר.',
      })
    }
  }

  return (
    <div className="grid gap-2">
      <Label>מקור מיקום</Label>
      <Select
        value={distanceType}
        onValueChange={setDistanceType}
      >
        <SelectTrigger>
          <SelectValue placeholder="בחר מקור מיקום" />
        </SelectTrigger>
        <SelectContent>
          {userMainAddress && (
            <SelectItem value="profile">
              כתובת ראשית:{' '}
              {`${userMainAddress.street_name} ${userMainAddress.street_number}, ${userMainAddress.city}, ${userMainAddress.country}`}
            </SelectItem>
          )}
          <SelectItem value="manual">כתובת ידנית</SelectItem>
          <SelectItem value="geo">מיקום נוכחי</SelectItem>
        </SelectContent>
      </Select>

      {distanceType === 'manual' && <ManualAddressInput />}

      {distanceType === 'geo' && (
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={isFetching}
        >
          {isFetching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LocateIcon className="mr-2 h-4 w-4" />
          )}
          {isFetching ? 'מאתר מיקום...' : 'השתמש במיקום נוכחי'}
        </Button>
      )}
    </div>
  )
}
