"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  FilePen,
  Loader,
  XCircle,
  Archive,
  Hourglass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ItemActions from "@/components/itemActions/ItemActions";
import { DbFoodItem } from "@/types/item/item";
import HoverImageCarousel from "@/components/hoverImageCarousel/HoverImageCarousel";
import { Badge } from "@/components/ui/badge";
import { ItemStatusEnum } from "@/types/item/item";

function getStatusBadge(status: ItemStatusEnum) {
  const statusMap: Record<
    ItemStatusEnum,
    {
      label: string;
      icon: React.ElementType;
      variant?: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    [ItemStatusEnum.Draft]: {
      label: "טיוטה",
      icon: FilePen,
      variant: "secondary",
    },
    [ItemStatusEnum.PendingPublication]: {
      label: "ממתין לאישור",
      icon: Loader,
      variant: "outline",
    },
    [ItemStatusEnum.Published]: {
      label: "פורסם",
      icon: CheckCircle,
      variant: "default",
    },
    [ItemStatusEnum.UpdatePending]: {
      label: "עדכון ממתין",
      icon: Clock,
      variant: "outline",
    },
    [ItemStatusEnum.Archived]: {
      label: "ארכיון",
      icon: Archive,
      variant: "secondary",
    },
    [ItemStatusEnum.Rejected]: {
      label: "נדחה",
      icon: XCircle,
      variant: "destructive",
    },
    [ItemStatusEnum.Expired]: {
      label: "פג תוקף",
      icon: Hourglass,
      variant: "destructive",
    },
  };

  const statusData = statusMap[status] || {
    label: status,
    icon: Clock,
    variant: "outline",
  };

  const Icon = statusData.icon;

  return (
    <Badge variant={statusData.variant} className='flex items-center gap-1'>
      <Icon className='h-4 w-4 rtl:ml-1 ltr:mr-1' />
      {statusData.label}
    </Badge>
  );
}

export const Columns: ColumnDef<DbFoodItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='rtl:mr-3'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='rtl:mr-3'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    id: "title",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className='ms-[-12px]'
        >
          שם פריט
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const item = row.original;
      if (!item) return null;

      return (
        <div className='flex items-center gap-2'>
          <HoverImageCarousel images={item.images || []} title={item.title} />
          <span className='truncate' title={item.title}>
            {item.title}
          </span>
        </div>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className='ms-[-12px]'
        >
          סטטוס
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const item = row.original;
      return getStatusBadge(item.status);
    },
  },
  {
    id: "description",
    accessorKey: "description",
    enableSorting: false,
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className='ms-[-12px]'
        >
          תיאור
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const item = row.original;

      return (
        <span className='truncate' title={item.description}>
          {item.description}
        </span>
      );
    },
  },
  {
    id: "Created At",
    accessorKey: "created_at",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className='ms-[-12px]'
        >
          תאריך יצירה
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span>
          {new Date(item.created_at).toLocaleDateString("he-IL", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    },
  },
  {
    id: "User Id",
    accessorKey: "user_id",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className='ms-[-12px]'
        >
          בעלים
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const item = row.original;
      return <span>{item.user_id || "לא זמין"}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ItemActions item={row.original} />,
  },
];
