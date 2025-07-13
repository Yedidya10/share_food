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
import { SortForm } from '../forms/sortForm/SortForm'
import { DirectionProvider } from '@radix-ui/react-direction'
import { useLocale } from 'next-intl'
import { MainAddress } from '@/types/supabase-fixed'

export default function SortDrawerDialog({
  openSort,
  setOpenSort,
  userMainAddress,
  userCommunities,
}: {
  openSort: boolean
  setOpenSort: React.Dispatch<React.SetStateAction<boolean>>
  userMainAddress?: MainAddress
  userCommunities?: {
    community_id: string
    communities: {
      id: string
      name: string
    } | null
  }[]
}) {
  const local = useLocale()
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768

  if (isDesktop) {
    return (
      <DirectionProvider dir={local === 'he' ? 'rtl' : 'ltr'}>
        <Dialog
          open={openSort}
          onOpenChange={setOpenSort}
        >
          <DialogContent className="sm:max-w-[425px] p-6">
            <DialogHeader className="py-2">
              <DialogTitle className="text-center ">מיון פריטים</DialogTitle>
              <DialogDescription className="rtl:text-right ltr:text-left text-sm text-muted-foreground">
                בחר את אופן המיון של הפריטים המוצגים. ניתן למיין לפי תאריך פרסום
                או מרחק.
              </DialogDescription>
            </DialogHeader>
            <SortForm
              userMainAddress={userMainAddress}
              userCommunities={userCommunities}
            />
          </DialogContent>
        </Dialog>
      </DirectionProvider>
    )
  }

  return (
    <DirectionProvider dir={local === 'he' ? 'rtl' : 'ltr'}>
      <Drawer
        open={openSort}
        onOpenChange={setOpenSort}
      >
        <DrawerContent>
          <DrawerHeader className="py-2">
            <DrawerTitle className="text-center">מיון פריטים</DrawerTitle>
            <DrawerDescription className="rtl:text-right ltr:text-left text-sm text-muted-foreground">
              בחר את אופן המיון של הפריטים המוצגים. ניתן למיין לפי תאריך פרסום
              או מרחק.
            </DrawerDescription>
          </DrawerHeader>
          <SortForm
            userMainAddress={userMainAddress}
            userCommunities={userCommunities}
          />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </DirectionProvider>
  )
}
