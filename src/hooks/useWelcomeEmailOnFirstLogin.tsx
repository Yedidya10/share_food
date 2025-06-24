"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { render } from "@react-email/render";
import WelcomeEmail from "@/components/emailTemplates/welcomeEmail/WelcomeEmail";
import { Session, User } from "@supabase/supabase-js";

export function useWelcomeEmailOnFirstLogin() {
  useEffect(() => {
    const supabase = createClient();

    const onSignedIn = async (session: Session) => {
      const user = session.user;
      if (!user) return;

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("welcome_email_sent")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (!profile?.welcome_email_sent) {
          await sendWelcomeEmail(user);
          await markWelcomeEmailAsSent(user.id);
        }
      } catch (err) {
        console.error("Error handling welcome email:", err);
      }
    };

    const sendWelcomeEmail = async (user: User) => {
      try {
        const userName = user.user_metadata?.full_name?.split(" ")[0] || "";

        const html = await render(
          <WelcomeEmail
            userName={userName}
            steps={[]}
            links={[
              {
                href: "https://sparebite.com",
                title: "בקר באתר SpareBite",
              },
            ]}
          />
        );

        await fetch("/api/send-welcome-oauth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            html,
          }),
        });
      } catch (err) {
        console.error("Failed to send welcome email:", err);
      }
    };

    const markWelcomeEmailAsSent = async (userId: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({ welcome_email_sent: true })
        .eq("id", userId);

      if (error) {
        console.error("Failed to mark email as sent:", error);
      }
    };

    const { data: authData } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          await onSignedIn(session);
        }
      }
    );

    return () => {
      authData?.subscription?.unsubscribe();
    };
  }, []);
}
