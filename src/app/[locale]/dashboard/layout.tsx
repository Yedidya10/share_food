import DashboardMenu from "@/components/dashboardMenu/DashboardMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardMenu>
      <main className='flex-1 p-4'>{children}</main>
    </DashboardMenu>
  );
}
