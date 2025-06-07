import AdminDashboardMenu from "@/components/adminDashboardMenu/AdminDashboardMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminDashboardMenu>
      <main className='flex-1 p-4'>{children}</main>
    </AdminDashboardMenu>
  );
}
