"use client";

import { Button } from "@/components/ui/button";
import { Filter, SortDesc } from "lucide-react";
import FilterDrawerDialog from "@/components/filterDrawerDialog/FilterDrawerDialog";

import ProductSearchBar from "@/components/productSearchBar/ProductSearchBar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import SortDrawerDialog from "@/components/sortDrawerDialog/SortDrawerDialog";

export default function FilterAndSearchBar() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);

  return (
    <div className='flex gap-3 m-auto w-full sticky top-0 z-50'>
      <FilterDrawerDialog
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
      />
      <SortDrawerDialog openFilter={openSort} setOpenFilter={setOpenSort} />
      <ProductSearchBar />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='h-12 w-12 rounded-xl'
            onClick={() => setOpenSort(true)}
            data-testid='sort-button'
            aria-label={"מיון פריטים"}
          >
            <SortDesc className='w-12 h-12' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>מיון פריטים</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='h-12 w-12 rounded-xl'
            onClick={() => setOpenFilter(true)}
            data-testid='filter-button'
            aria-label={"סינון פריטים"}
          >
            <Filter className='w-12 h-12' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>סינון פריטים</TooltipContent>
      </Tooltip>
    </div>
  );
}
