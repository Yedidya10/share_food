import DashboardLayout from "@/components/layouts/Dashboard";
import { Shapes, Users } from "lucide-react";

const navItems = [
  { label: "Users", href: "/admin-dashboard/users", icon: <Users /> },
  { label: "Items", href: "/admin-dashboard/items", icon: <Shapes /> },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout navItems={navItems}>{children}</DashboardLayout>;
}
