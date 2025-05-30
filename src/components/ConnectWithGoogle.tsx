"use client";

import { Button } from "@/components/ui/button";
import { signInWithOAuth } from "@/lib/supabase/actions";

export default function ConnectWithGoogle() {
  return (
    <Button onClick={() => signInWithOAuth("google")}>
      Connect with Google
    </Button>
  );
}
