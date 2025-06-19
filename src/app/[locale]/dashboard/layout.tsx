// app/[locale]/dashboard/layout.tsx

import DashboardLayout from "@/components/layouts/Dashboard";
import { CircleUserRound, Settings, Shapes } from "lucide-react";

const navItems = [
  { label: "Profile", href: "/dashboard/profile", icon: <CircleUserRound /> },
  { label: "My Items", href: "/dashboard/my-items", icon: <Shapes /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings /> },
];

export default function DashboardUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout navItems={navItems}>{children}</DashboardLayout>;
}
