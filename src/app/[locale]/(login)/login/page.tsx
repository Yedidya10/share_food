"use client";

import ConnectWithGoogle from "@/components/ConnectWithGoogle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function LoginModal() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const safeRedirect = redirect.startsWith("/") ? redirect : "/"; // Fallback to root if redirect is invalid for security
  const router = useRouter();

  const tLogin = useTranslations("header.login");

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>התחברות</DialogTitle>
        </DialogHeader>
        <ConnectWithGoogle
          redirectTo={safeRedirect}
          translation={{
            ConnectWithGoogle: tLogin("connectWith", { provider: "Google" }),
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
