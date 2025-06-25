"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
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
          <DialogDescription>ערוך את הפריט כדי להמשיך</DialogDescription>
        </VisuallyHidden>
        <DialogContent className='max-h-[80vh] md:min-w-[700px] overflow-y-auto rounded-lg'>
          {children}
        </DialogContent>
      </Dialog>
    </DirectionProvider>
  );
}
