"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function EditItemDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Dialog open={true} onOpenChange={(open) => !open && router.back()}>
      <DialogContent className='pt-10'>
        {/* Visually hidden title for screen readers */}
        <VisuallyHidden>
          <DialogTitle>עריכת פריט</DialogTitle>
        </VisuallyHidden>
        {children}
      </DialogContent>
    </Dialog>
  );
}
