import UserDashboardMenu from "@/components/userDashboardMenu/UserDashboardMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-[calc(100vh-80px)] overflow-y-auto p-4'>
      <UserDashboardMenu>{children}</UserDashboardMenu>
    </div>
  );
}
