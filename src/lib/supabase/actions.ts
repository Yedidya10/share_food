"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
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
