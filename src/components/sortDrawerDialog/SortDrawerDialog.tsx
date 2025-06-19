"use client";

// import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { SortForm } from "../forms/sortForm/SortForm";

export default function SortDrawerDialog({
  openSort,
  setOpenSort,
}: {
  openSort: boolean;
  setOpenSort: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  if (isDesktop) {
    return (
      <Dialog open={openSort} onOpenChange={setOpenSort}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>סינון פריטים</DialogTitle>
            <DialogDescription>
              <p className='text-sm text-muted-foreground'>
                השתמש בסינון כדי למצוא פריטים מתאימים לצרכים שלך.
              </p>
            </DialogDescription>
          </DialogHeader>
          <SortForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={openSort} onOpenChange={setOpenSort}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>סינון פריטים</DrawerTitle>
          <DrawerDescription>
            <p className='text-sm text-muted-foreground'>
              השתמש בסינון כדי למצוא פריטים מתאימים לצרכים שלך.
            </p>
          </DrawerDescription>
        </DrawerHeader>
        <SortForm />
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
