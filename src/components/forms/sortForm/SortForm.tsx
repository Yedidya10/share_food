"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LocateIcon } from "lucide-react";

type Props = {
  userDefaultAddress?: string;
  onSortChange?: (
    sortBy: string,
    locationData?: { latitude: number; longitude: number } | string | undefined
  ) => void;
};

export function SortForm({ userDefaultAddress, onSortChange }: Props) {
  const [sortBy, setSortBy] = useState("date");
  const [distanceType, setDistanceType] = useState(
    userDefaultAddress ? "profile" : "manual"
  );
  const [manualAddress, setManualAddress] = useState("");

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      alert(`המיקום שלך: (${pos.coords.latitude}, ${pos.coords.longitude})`);
      // שלח מיקום ל־onSortChange אם צריך
    });
  };

  return (
    <form className='grid gap-4'>
      <div className='grid gap-2'>
        <Label>מיין לפי</Label>
        <Select
          value={sortBy}
          onValueChange={(v) => {
            setSortBy(v);
            onSortChange?.(v);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder='בחר מיון' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='date'>תאריך פרסום (ברירת מחדל)</SelectItem>
            <SelectItem value='distance'>מרחק ממני</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortBy === "distance" && (
        <div className='grid gap-2'>
          <Label>מקור מיקום</Label>
          <Select value={distanceType} onValueChange={setDistanceType}>
            <SelectTrigger>
              <SelectValue placeholder='בחר מקור מיקום' />
            </SelectTrigger>
            <SelectContent>
              {userDefaultAddress && (
                <SelectItem value='profile'>
                  מהפרופיל: {userDefaultAddress}
                </SelectItem>
              )}
              <SelectItem value='manual'>כתובת ידנית</SelectItem>
              <SelectItem value='geo'>מיקום נוכחי</SelectItem>
            </SelectContent>
          </Select>

          {distanceType === "manual" && (
            <Input
              placeholder='כתוב את הכתובת שלך'
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
          )}

          {distanceType === "geo" && (
            <Button type='button' variant='outline' onClick={handleLocate}>
              <LocateIcon className='mr-2 h-4 w-4' /> אתר אותי
            </Button>
          )}
        </div>
      )}

      <Button type='submit' className='mt-2'>
        החל מיון
      </Button>
    </form>
  );
}
