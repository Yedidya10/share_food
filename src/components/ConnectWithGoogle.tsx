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
    <Button onClick={() => signInWithOAuth("google")}>
      <FaGoogle />
      <span className='ml-2'>{translation.ConnectWithGoogle}</span>
    </Button>
  );
}
