'use client'

import { useState, useEffect } from 'react'
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
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

// Import the server action
import getListUsers from '@/app/actions/getListUsers'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>([])
  const [total, setTotal] = useState(0)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 1 })

  // Fetch data whenever pagination, sorting, or filters change
  useEffect(() => {
    async function fetchData() {
      // server action expects 1-based page
      const page = pagination.pageIndex + 1
      const perPage = pagination.pageSize
      const result = await getListUsers(page, perPage)
      if (result.data) {
        setData(result.data.users as TData[])
        setTotal(result.data.total)
      } else {
        setData([])
      }
    }
    fetchData()
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    columnFilters,
    pagination,
  ])

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: { sorting, columnFilters, columnVisibility, pagination },
    pageCount: Math.ceil(total / pagination.pageSize),
  })

  return (
    <div className="space-y-4 p-4 overflow-y-auto h-full">
      <div className="flex  items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-auto"
          >
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="rtl:text-right"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          title="Previous Page"
          aria-label="Previous Page"
          size={'icon'}
        >
          <ChevronsLeft className="rtl:rotate-180" />
        </Button>
        <Button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
          title="First Page"
          aria-label="First Page"
          size={'icon'}
        >
          <ChevronLeft className="rtl:rotate-180" />
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          title="Next Page"
          aria-label="Next Page"
          size={'icon'}
        >
          <ChevronRight className="rtl:rotate-180" />
        </Button>
        <Button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
          title="Last Page"
          aria-label="Last Page"
          size={'icon'}
        >
          <ChevronsRight className="rtl:rotate-180" />
        </Button>
        <Select
          onValueChange={(value) => {
            const size = Number(value)
            table.setPageSize(size)
          }}
        >
          <SelectTrigger className="w-20">
            <SelectValue
              placeholder={table.getState().pagination.pageSize.toString()}
            />
          </SelectTrigger>
          <SelectContent className="w-20 min-w-0">
            {[1, 2, 50, 100].map((size) => (
              <SelectItem
                key={size}
                value={size.toString()}
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
