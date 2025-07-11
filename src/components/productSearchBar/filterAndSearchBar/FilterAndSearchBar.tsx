'use client'

import { Button } from '@/components/ui/button'
import { Filter, SortDesc } from 'lucide-react'
import FilterDrawerDialog from '@/components/filterDrawerDialog/FilterDrawerDialog'
import ProductSearchBar from '@/components/productSearchBar/ProductSearchBar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useState } from 'react'
import SortDrawerDialog from '@/components/sortDrawerDialog/SortDrawerDialog'
import useProfile from '@/hooks/db/useProfile'

export default function FilterAndSearchBar() {
  const [openFilter, setOpenFilter] = useState(false)
  const [openSort, setOpenSort] = useState(false)
  const { data: profileData } = useProfile()

  return (
    <div className="flex p-3 gap-3 w-full sticky top-[60px] z-50 bg-white dark:bg-[black] opacity-98">
      <FilterDrawerDialog
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        userMainAddress={profileData?.main_address ?? undefined}
      />
      <SortDrawerDialog
        openSort={openSort}
        setOpenSort={setOpenSort}
        userMainAddress={profileData?.main_address ?? undefined}
      />
      <ProductSearchBar />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-xl"
            onClick={() => setOpenSort(true)}
            data-testid="sort-button"
            aria-label={'מיון פריטים'}
          >
            <SortDesc className="w-12 h-12" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>מיון פריטים</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-xl"
            onClick={() => setOpenFilter(true)}
            data-testid="filter-button"
            aria-label={'סינון פריטים'}
          >
            <Filter className="w-12 h-12" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>סינון פריטים</TooltipContent>
      </Tooltip>
    </div>
  )
}
