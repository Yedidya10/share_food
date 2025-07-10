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
import { CalendarIcon, XIcon } from 'lucide-react'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
// import { Checkbox } from '@/components/ui/checkbox'

// const CATEGORIES = [
//   { value: 'vegan', label: 'טבעוני' },
//   { value: 'vegetarian', label: 'צמחוני' },
//   { value: 'glutenfree', label: 'ללא גלוטן' },
//   { value: 'organic', label: 'אורגני' },
//   // הוסף עוד קטגוריות לפי הצורך
// ]

export function FilterForm({
  className,
  onOpenChange,
  open,
}: {
  className?: string
  onOpenChange: ((open: boolean) => void) | undefined
  open: boolean
}) {
  const searchParams = useSearchParams()
  const router = useRouter()

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
  // מפריד בין קטגוריות ע"י פסיק, נאסוף למערך
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cats = searchParams.get('categories')
    return cats ? cats.split(',') : []
  })

  const updateUrlParams = (params: Record<string, string | undefined>) => {
    const current = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value) current.set(key, value)
      else current.delete(key)
    })

    current.set('page', '0')

    router.replace('?' + current.toString())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateUrlParams({
      distance: maxDistance || undefined,
      fromDate: fromDate?.toISOString().split('T')[0],
      toDate: toDate?.toISOString().split('T')[0],
      categories:
        selectedCategories.length > 0
          ? selectedCategories.join(',')
          : undefined,
    })

    if (open) {
      onOpenChange?.(false) // סגירת הדיאלוג או הדראוור אם פתוח
    }
  }

  const handleReset = () => {
    updateUrlParams({
      distance: undefined,
      fromDate: undefined,
      toDate: undefined,
      categories: undefined,
    })

    setMaxDistance('')
    setFromDate(undefined)
    setToDate(undefined)
    setSelectedCategories([])
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

      {/* קטגוריות */}
      {/* <div className="grid gap-2">
        <Label>קטגוריות</Label>
        <div className="flex flex-col space-y-1">
          {CATEGORIES.map(({ value, label }) => (
            <label
              key={value}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Checkbox
                checked={selectedCategories.includes(value)}
                onChange={() => {
                  setSelectedCategories((prev) =>
                    prev.includes(value)
                      ? prev.filter((c) => c !== value)
                      : [...prev, value],
                  )
                }}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div> */}

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Button type="submit">החל סינון</Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
        >
          <XIcon className="mr-2 h-4 w-4" />
          איפוס
        </Button>
      </div>
    </form>
  )
}
