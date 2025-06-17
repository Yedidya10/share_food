"use server";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";

const getSiteUrl = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "https://localhost:3000/";
  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;
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
