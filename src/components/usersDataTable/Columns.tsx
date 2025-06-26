'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import UserActions from '@/components/userActions/UserActions'

export const Columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="rtl:mr-3"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="rtl:mr-3"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'Full Name',
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          שם מלא
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center space-x-3">
          <Image
            src={user.user_metadata?.avatar_url}
            alt={`${user.user_metadata?.full_name}'s profile picture`}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span>{user.user_metadata?.full_name}</span>
        </div>
      )
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          דואר אלקטרוני
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original
      return <span>{user.email}</span>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <UserActions user={row.original} />,
  },
]
