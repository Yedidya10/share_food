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
import { MainAddress } from '@/types/supabase-fixed'

export default function FilterDrawerDialog({
  openFilter,
  setOpenFilter,
  userMainAddress,
  userCommunities,
}: {
  openFilter: boolean
  setOpenFilter: (open: boolean) => void
  userMainAddress?: MainAddress
  userCommunities?: {
    community_id: string
    communities: {
      id: string
      name: string
    } | null
  }[]
}) {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768

  if (isDesktop) {
    return (
      <Dialog
        open={openFilter}
        onOpenChange={setOpenFilter}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="py-3">
            <DialogTitle className="text-center">סינון פריטים</DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              השתמש בסינון כדי למצוא פריטים מתאימים לצרכים שלך.
            </DialogDescription>
          </DialogHeader>
          <FilterForm
            onOpenChange={setOpenFilter}
            open={openFilter}
            userMainAddress={userMainAddress}
            userCommunities={userCommunities}
          />
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
          <DrawerTitle className="text-center">סינון פריטים</DrawerTitle>
          <DrawerDescription className="rtl:text-right ltr:text-left text-sm text-muted-foreground">
            השתמש בסינון כדי למצוא פריטים מתאימים לצרכים שלך.
          </DrawerDescription>
        </DrawerHeader>
        <FilterForm
          onOpenChange={setOpenFilter}
          open={openFilter}
          userMainAddress={userMainAddress}
          userCommunities={userCommunities}
          className="px-4"
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
