"use server";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";

const getSiteUrl = () => {
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
  const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
  const isDevelopment = process.env.NEXT_PUBLIC_VERCEL_ENV === "development";

  let url = isProduction
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : isPreview
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : isDevelopment
        ? "https://localhost:3000"
        : null;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL or NEXT_PUBLIC_VERCEL_URL is not set. Please set it in your environment variables."
    );
  }

  if (url.startsWith("http://")) {
    url = url.replace("http://", "https://");
  }

  return url;
};

export async function signInWithOAuthServer({
  provider,
  redirectTo,
  locale,
}: {
  provider: Provider;
  redirectTo: string;
  locale: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(
        redirectTo
      )}`,
    },
  });
  if (error) {
    redirect({ href: "/error", locale });
  }
  if (data?.url) {
    redirect({ href: data.url, locale });
  }
}

export async function oauthAction(formData: FormData) {
  const provider = formData.get("provider") as Provider;
  const redirectTo = formData.get("redirectTo") as string;
  const locale = formData.get("locale") as string;
  await signInWithOAuthServer({ provider, redirectTo, locale });
}
