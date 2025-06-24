"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { render } from "@react-email/render";
import WelcomeEmail from "@/components/emailTemplates/welcomeEmail/WelcomeEmail";
import type { Session, User } from "@supabase/supabase-js";

const LOCALSTORAGE_KEY = "welcome_email_sent";

// Helper to parse full_name into first and last name
function parseName(fullName?: string): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: "", lastName: "" };
  const [firstName = "", lastName = ""] = fullName.split(" ");
  return { firstName, lastName };
}

export default function useWelcomeEmailOnFirstLogin() {
  useEffect(() => {
    const supabase = createClient();

    async function sendWelcomeEmail(user: User) {
      try {
        const { firstName } = parseName(user.user_metadata?.full_name);
        const userName = firstName || "משתמש יקר";
        const html = render(
          <WelcomeEmail
            userName={userName}
            steps={[]}
            links={[
              { href: "https://sparebite.com", title: "בקר באתר SpareBite" },
            ]}
          />
        );
        await fetch("/api/send-welcome-oauth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, html }),
        });
      } catch (err) {
        console.error("Failed to send welcome email:", err);
      }
    }

    async function handleUser(session: Session) {
      const user = session.user;
      if (!user) return;

      // בדיקה אם כבר שלחנו מייל בפעם הקודמת (localStorage)
      if (typeof window !== "undefined") {
        const localSent = localStorage.getItem(LOCALSTORAGE_KEY);
        if (localSent === user.id) {
          // כבר שלחנו, לא נמשיך
          return;
        }
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, welcome_email_sent")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError);
        return;
      }

      if (!profile) {
        const { firstName, lastName } = parseName(
          user.user_metadata?.full_name
        );
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || "",
          first_name: firstName,
          last_name: lastName,
          phone: user.phone ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
          welcome_email_sent: false,
        });

        if (insertError) {
          console.error("Error inserting profile:", insertError);
          return;
        }
      }

      if (!profile || !profile.welcome_email_sent) {
        await sendWelcomeEmail(user);

        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            welcome_email_sent: true,
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Failed to mark welcome email as sent:", updateError);
        } else {
          // סימון ב-localStorage שאפשר למנוע ריצה חוזרת
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCALSTORAGE_KEY, user.id);
          }
        }
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          await handleUser(session);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);
}
