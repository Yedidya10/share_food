import AdminDashboardMenu from "@/components/adminDashboardMenu/AdminDashboardMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-[calc(100vh-80px)] overflow-y-auto p-4'>
      <AdminDashboardMenu>{children}</AdminDashboardMenu>
    </div>
  );
}
