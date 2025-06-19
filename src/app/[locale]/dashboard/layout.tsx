import UserDashboardMenu from "@/components/userDashboardMenu/UserDashboardMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-y-auto relative'>
      <UserDashboardMenu />
      <main className='w-full overflow-y-auto p-4'>{children}</main>
    </div>
  );
}
