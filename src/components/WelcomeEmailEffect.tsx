"use client";

import useWelcomeEmailOnFirstLogin from "@/hooks/useWelcomeEmailOnFirstLogin";

export default function WelcomeEmailEffect() {
  useWelcomeEmailOnFirstLogin();
  return null;
}
