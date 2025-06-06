import UserDashboardMenu from "@/components/userDashboardMenu/UserDashboardMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserDashboardMenu>
      <main className='flex-1 p-4'>{children}</main>
    </UserDashboardMenu>
  );
}
