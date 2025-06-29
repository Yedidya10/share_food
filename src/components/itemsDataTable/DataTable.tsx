'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useInView } from 'react-intersection-observer'
import useItems from '@/hooks/db/useItems'
import { cn } from '@/lib/utils'
import { DirectionProvider } from '@radix-ui/react-direction'
import { useLocale } from 'next-intl'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const locale = useLocale()
  const {
    data: pages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useItems()

  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  const items = useMemo(() => {
    return pages?.pages.flat() ?? []
  }, [pages])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data: items,
    columns,
    state: {
      columnFilters,
      sorting,
      columnVisibility,
    },
    columnResizeMode: 'onChange',
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  return (
    <DirectionProvider dir={locale === 'he' ? 'rtl' : 'ltr'}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="חפש לפי שם..."
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('title')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">עמודות</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border rtl:text-right ltr:text-left">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="rtl:text-right ltr:text-left"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center"
                  >
                    טוען נתונים...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div
            ref={ref}
            className={cn(
              'py-4 text-center',
              isFetchingNextPage && 'opacity-50',
            )}
          >
            {isFetchingNextPage
              ? 'טוען עוד...'
              : hasNextPage
                ? 'גלול לטעינה נוספת'
                : 'הגעת לסוף'}
          </div>
        </div>
      </div>
    </DirectionProvider>
  )
}
