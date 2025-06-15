"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

type Props = React.ComponentProps<"form">;

export function FilterForm({ className }: Props) {
  const [maxDistance, setMaxDistance] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  return (
    <form className={cn("grid gap-4", className)}>
      {/* מרחק */}
      <div className='grid gap-2'>
        <Label htmlFor='maxDistance'>מרחק מקסימלי (ק״מ)</Label>
        <Input
          id='maxDistance'
          type='number'
          placeholder='לדוג׳ 10'
          value={maxDistance}
          onChange={(e) => setMaxDistance(e.target.value)}
        />
      </div>

      {/* טווח תאריכים */}
      <div className='grid gap-2'>
        <Label>טווח תאריכי פרסום</Label>
        <div className='grid grid-cols-2 gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline'>
                <CalendarIcon className='mr-2 h-4 w-4' />
                {fromDate ? format(fromDate, "dd/MM/yyyy", { locale: he }) : "מתאריך"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={fromDate}
                onSelect={setFromDate}
                locale={he}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline'>
                <CalendarIcon className='mr-2 h-4 w-4' />
                {toDate ? format(toDate, "dd/MM/yyyy", { locale: he }) : "עד תאריך"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={toDate}
                onSelect={setToDate}
                locale={he}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button type='submit' className='mt-2'>החל סינון</Button>
    </form>
  );
}
