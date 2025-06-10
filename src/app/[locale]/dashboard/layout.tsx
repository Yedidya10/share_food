import UserDashboardMenu from "@/components/userDashboardMenu/UserDashboardMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserDashboardMenu>{children}</UserDashboardMenu>;
}
