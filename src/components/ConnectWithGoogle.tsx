"use client";

import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signInWithOAuth } from "@/lib/supabase/actions";

export default function ConnectWithGoogle({
  translation,
}: {
  translation: {
    ConnectWithGoogle: string;
  };
}) {
  return (
    <Button
      onClick={() => signInWithOAuth("google")}
      className='bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 w-full flex items-center justify-center cursor-pointer'
    >
      <FaGoogle className='text-gray-900 dark:text-gray-100' />
      <span className='ml-2'>{translation.ConnectWithGoogle}</span>
    </Button>
  );
}
