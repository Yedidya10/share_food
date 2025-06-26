'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontal,
  Trash2,
  ClipboardCopy,
  Pencil,
  EyeOff,
  Eye,
} from 'lucide-react'
import { DbFoodItem, ItemStatusEnum } from '@/types/item/item'
import { useRouter } from '@/i18n/navigation'
import { useUpdateItemStatus } from '@/hooks/db/useUpdateItemStatus'
import { useDeleteItem } from '@/hooks/db/useDeleteItem'

export default function ItemActions({ item }: { item: DbFoodItem }) {
  const router = useRouter()
  const [openDialog, setOpenDialog] = useState(false)
  const { mutate: updateStatus, isPending: isPendingUpdate } =
    useUpdateItemStatus()
  const { mutate: deleteItem, isPending: isPendingDelete } = useDeleteItem()

  return (
    <>
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) {
            router.prefetch(`/edit-item/${item.id}`)
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">פתיחת תפריט</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>פעולות לפריט</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(item.id)}
            className="flex items-center "
            aria-label="העתקת מזהה פריט"
          >
            <ClipboardCopy />
            <span>העתקת מזהה פריט</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {item.status === 'pending_publication' ||
          item.status === 'update_pending' ? (
            <DropdownMenuItem
              className="flex items-center"
              disabled={isPendingUpdate}
              onClick={() =>
                updateStatus({ id: item.id, status: ItemStatusEnum.Published })
              }
              aria-label="פרסום פריט"
            >
              <Eye className="w-4 h-4" />
              פרסום הפריט
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="flex items-center"
              disabled={isPendingUpdate}
              onClick={() =>
                updateStatus({
                  id: item.id,
                  status: ItemStatusEnum.PendingPublication,
                })
              }
              aria-label="החזרה להמתנה לפרסום"
            >
              <EyeOff className="w-4 h-4" />
              <span>החזרה להמתנה</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => {
              router.push(`/edit-item/${item.id}`)
            }}
            className="flex items-center space-x-1"
            aria-label="עריכת פריט"
          >
            <Pencil />
            <span>עריכת פריט</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDialog(true)}
            variant="destructive"
            className="flex items-center space-x-1"
            aria-label="מחיקת פריט"
          >
            <Trash2 className="text-red-400" />
            <span className="text-red-400">מחיקת פריט</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={openDialog}
        onOpenChange={setOpenDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>מחיקת פריט</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Are you sure?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deleteItem(item.id)}
              disabled={isPendingDelete}
              aria-label="אשר מחיקת פריט"
            >
              {isPendingDelete ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
