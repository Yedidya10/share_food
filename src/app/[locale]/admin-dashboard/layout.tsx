import AdminDashboardMenu from "@/components/adminDashboardMenu/AdminDashboardMenu";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  try {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      throw new Error(userError.message);
    }

    const { data: userRoles, error: errorRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData?.user?.id);

    if (errorRoles) {
      throw new Error(errorRoles.message);
    }

    const isAdmin = userRoles?.some((role) => role.role === "admin");
    if (!isAdmin) {
      throw new Error("Access denied: Admin role required");
    }

    return (
      <>{isAdmin && <AdminDashboardMenu>{children}</AdminDashboardMenu>}</>
    );
  } catch (error) {
    console.error(error);
    if (
      error instanceof Error &&
      error.message === "Access denied: Admin role required"
    ) {
      return redirect({ href: "/", locale });
    }

    if (error instanceof Error && error.message.includes("not authenticated")) {
      return redirect({ href: "/login", locale });
    }

    return null;
  }
}
