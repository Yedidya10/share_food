"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
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
import { getCoordinatesFromAddress } from "@/lib/googleMaps/location";

export function SortForm({
  userDefaultAddress,
}: {
  userDefaultAddress?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sortBy, setSortBy] = useState(searchParams.get("sort") ?? "date");
  const [distanceType, setDistanceType] = useState(
    userDefaultAddress ? "profile" : "manual"
  );
  const [manualAddress, setManualAddress] = useState("");

  useEffect(() => {
    setSortBy(searchParams.get("sort") ?? "date");
  }, [searchParams]);

  const updateUrlParams = (params: Record<string, string | undefined>) => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) current.set(key, value);
      else current.delete(key);
    });

    current.set("page", "0"); // אפס את עמוד האינסוף

    router.replace("?" + current.toString());
  };

  const handleSortChange = async () => {
    if (sortBy === "distance") {
      if (distanceType === "manual" && manualAddress) {
        const coords = await getCoordinatesFromAddress(manualAddress);
        if (coords) {
          updateUrlParams({
            sort: "distance",
            lat: coords.lat.toString(),
            lng: coords.lng.toString(),
          });
        }
      } else if (distanceType === "geo") {
        navigator.geolocation.getCurrentPosition((pos) => {
          updateUrlParams({
            sort: "distance",
            lat: pos.coords.latitude.toString(),
            lng: pos.coords.longitude.toString(),
          });
        });
      } else {
        // פרופיל - לא מוגדר פה, אבל תוכל לשלוח lat/lng דרך props
        updateUrlParams({ sort: "distance" });
      }
    } else {
      updateUrlParams({
        sort: "date",
        lat: undefined,
        lng: undefined,
      });
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSortChange();
      }}
      className='grid gap-4'
    >
      <div className='grid gap-2'>
        <Label>מיין לפי</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
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
              placeholder='הזן את הכתובת שלך'
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
          )}

          {distanceType === "geo" && (
            <Button type='button' variant='outline' onClick={handleSortChange}>
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
