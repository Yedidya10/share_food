"use client";

import { useRouter } from "@/i18n/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useLocale } from "next-intl";

export default function EditItemFormDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const locale = useLocale();

  return (
    <DirectionProvider dir={locale === "he" ? "rtl" : "ltr"}>
      <Dialog open={true} onOpenChange={(open) => !open && router.back()}>
        <DialogContent
        // className='sm:max-w-[725px] overflow-y-auto flex flex-col gap-8'
        >
          {children}
        </DialogContent>
      </Dialog>
    </DirectionProvider>
  );
}
