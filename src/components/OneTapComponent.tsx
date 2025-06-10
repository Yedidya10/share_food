"use client";

import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";

export default function OneTapComponent() {
  const supabase = createClient();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const generateNonce = async (): Promise<[string, string]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return [nonce, hashedNonce];
  };

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!scriptLoaded || initializedRef.current) return;
    initializedRef.current = true;

    const initializeGoogleOneTap = async () => {
      const [nonce, hashedNonce] = await generateNonce();

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session", error);
        return;
      }
      if (data.session) {
        return;
      }

      if (
        typeof window === "undefined" ||
        !window.google ||
        !window.google.accounts ||
        !window.google.accounts.id
      ) {
        console.error("Google One Tap script not loaded properly");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: async (response: any) => {
          try {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: response.credential,
              nonce,
            });

            if (error) throw error;
            console.log("Successfully signed in");
          } catch (error) {
            console.error("Login error", error);
          }
        },
        nonce: hashedNonce,
        // use_fedcm_for_prompt: true, // Uncomment if you want to use FedCM
        auto_select: true, // Automatically select the account if available
        cancel_on_tap_outside: true, // Allow tapping outside to close the prompt
      });

      window.google.accounts.id.prompt();
    };

    initializeGoogleOneTap();
  }, [scriptLoaded, supabase.auth]);

  return (
    <>
      <Script
        src='https://accounts.google.com/gsi/client'
        strategy='afterInteractive'
        onLoad={() => setScriptLoaded(true)}
      />
      <div id='oneTap' className='fixed top-0 right-0 z-[100]' />
    </>
  );
}
