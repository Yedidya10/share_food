'use client'

// import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { FilterForm } from '../forms/filterForm/FilterForm'

export default function FilterDrawerDialog({
  openFilter,
  setOpenFilter,
}: {
  openFilter: boolean
  setOpenFilter: (open: boolean) => void
}) {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768

  if (isDesktop) {
    return (
      <Dialog
        open={openFilter}
        onOpenChange={setOpenFilter}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>סינון פריטים</DialogTitle>
            <DialogDescription>
              <p className="text-sm text-muted-foreground">
                השתמש בסינון כדי למצוא פריטים מתאימים לצרכים שלך.
              </p>
            </DialogDescription>
          </DialogHeader>
          <FilterForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={openFilter}
      onOpenChange={setOpenFilter}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>סינון פריטים</DrawerTitle>
          <DrawerDescription>
            <p className="text-sm text-muted-foreground">
              השתמש בסינון כדי למצוא פריטים מתאימים לצרכים שלך.
            </p>
          </DrawerDescription>
        </DrawerHeader>
        <FilterForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
