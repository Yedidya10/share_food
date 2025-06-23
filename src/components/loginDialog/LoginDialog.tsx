"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function LoginDialog({
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
          <DialogTitle>התחברות</DialogTitle>
        </VisuallyHidden>
        {children}
      </DialogContent>
    </Dialog>
  );
}
