"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
import type { Provider } from "@supabase/auth-js";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect({ href: "/error", locale: "en" });
  }

  revalidatePath("/", "layout");
  redirect({ href: "/", locale: "en" });
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect({ href: "/error", locale: "en" });
  }

  revalidatePath("/", "layout");
  redirect({ href: "/", locale: "en" });
}

export async function logout({ locale }: { locale: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect({ href: "/error", locale });
  }

  revalidatePath("/", "layout");
  redirect({ href: "/", locale });
}

const getSiteUrl = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "https://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

export async function signInWithOAuth({
  provider,
  redirectTo = "/",
  locale,
}: {
  provider: Provider;
  redirectTo?: string;
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

  if (error) redirect({ href: "/error", locale });
  if (data?.url) redirect({ href: data.url, locale });
}
