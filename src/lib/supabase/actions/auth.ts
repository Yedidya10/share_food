"use server";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

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
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  let url: string | null = null;

  if (env === "production") {
    const prodUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
    if (!prodUrl) {
      throw new Error(
        "NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL is not set. Please set it in your environment variables."
      );
    }
    url = `https://${prodUrl}`;
  }

  if (env === "preview") {
    const previewUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
    if (!previewUrl) {
      throw new Error(
        "NEXT_PUBLIC_VERCEL_URL is not set. Please set it in your environment variables."
      );
    }
    url = `https://${previewUrl}`;
  }

  if (env === "development") {
    // Allow override for dev URL, fallback to localhost:3000
    url = process.env.NEXT_PUBLIC_DEV_URL || "http://localhost:3000";
  }

  if (!url) {
    throw new Error(
      "Unable to determine site URL. Please check your environment variables."
    );
  }

  // Always use https in production/preview, but allow http in dev if needed
  if (env !== "development" && url.startsWith("http://")) {
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
