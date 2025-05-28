"use client";

import { Button } from "@/components/ui/button";
import { signInWithOAuth } from "@/lib/supabase/actions";

export default function SignInWithGoogle() {
  return (
    <Button onClick={() => signInWithOAuth("google")}>
      Sign in with Google
    </Button>
  );
}
