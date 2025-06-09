"use client";

import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signInWithOAuth } from "@/lib/supabase/actions";
import { Locale, useLocale } from "next-intl";

export default function ConnectWithGoogle({
  redirectTo,
  translation,
}: {
  redirectTo: string;
  translation: {
    ConnectWithGoogle: string;
  };
}) {
  const locale = useLocale() as Locale;
  
  return (
    <Button
      onClick={() => signInWithOAuth({ provider: "google", redirectTo, locale })}
      className='bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 w-full flex items-center justify-center cursor-pointer'
    >
      <FaGoogle className='text-gray-900 dark:text-gray-100' />
      <span className='ml-2'>{translation.ConnectWithGoogle}</span>
    </Button>
  );
}
