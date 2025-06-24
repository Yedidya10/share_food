"use client";

import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useLocale } from "next-intl";

export default function EditItemDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const locale = useLocale();

  return (
    <DirectionProvider dir={locale === "he" ? "rtl" : "ltr"}>
      <Dialog open={true} onOpenChange={(open) => !open && router.back()}>
        {/* Visually hidden title for screen readers */}
        <VisuallyHidden>
          <DialogTitle>עריכת פריט</DialogTitle>
        </VisuallyHidden>
        <DialogContent className='h-full max-h-[90vh] overflow-y-auto'>
          {children}
        </DialogContent>
      </Dialog>
    </DirectionProvider>
  );
}
