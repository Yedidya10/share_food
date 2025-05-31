"use client";

import ConnectWithGoogle from "@/components/ConnectWithGoogle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginModal() {
  const tLogin = useTranslations("header.login");
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>התחברות</DialogTitle>
        </DialogHeader>
        <ConnectWithGoogle
          translation={{
            ConnectWithGoogle: tLogin("connectWith", { provider: "Google" }),
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
