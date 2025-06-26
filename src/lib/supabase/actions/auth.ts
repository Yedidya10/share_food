"use server";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { siteUrl } from "@/lib/envConfig";

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
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(
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
