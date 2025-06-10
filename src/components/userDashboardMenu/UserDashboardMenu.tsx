"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { CircleUserRound, Settings, Shapes } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

const navItems = [
  { label: "Profile", href: "/dashboard/profile", icon: <CircleUserRound /> },
  { label: "My Items", href: "/dashboard/my-items", icon: <Shapes /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings /> },
];

export default function UserDashboardMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className='flex flex-col md:flex-row text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100 h-[calc(100vh-80px)] relative'>
      <div className='md:hidden top-0 left-0 z-50 sticky '>
        <NavigationMenu className='block max-w-full'>
          <NavigationMenuList>
            <NavigationMenuItem className='w-full'>
              <NavigationMenuTrigger className='w-full max-w-full'>
                Menu
              </NavigationMenuTrigger>
              <NavigationMenuContent className='block max-w-full w-full'>
                <ul className='w-[calc(100vw-2rem)]'>
                  {navItems.map((item) => (
                    <li key={item.href} className=''>
                      <NavigationMenuLink
                        asChild
                        className={cn(
                          "flex p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                          pathname === item.href &&
                            "bg-gray-300 font-semibold dark:bg-gray-600"
                        )}
                      >
                        <Link
                          href={item.href}
                          className='flex items-center gap-2'
                        >
                          <div className='flex items-center h-8 gap-2'>
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuViewport
            className='absolute left-0 top-full mt-1 w-full overflow-hidden rounded-md bg-white dark:bg-gray-900 shadow-lg'
            style={
              {
                "--radix-navigation-menu-viewport-width": "100%",
              } as React.CSSProperties
            }
          />
        </NavigationMenu>
      </div>
      <nav
        className='hidden md:block
          w-[max(180px,18%)] sticky top-0 h-full bg-gray-100 p-4 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700'
      >
        <ul className='space-y-2'>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                  pathname === item.href &&
                    "bg-gray-300 font-semibold dark:bg-gray-600"
                )}
              >
                <div className='flex items-center gap-2'>
                  {item.icon}
                  <span className='md:inline'>{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className='flex-auto'>{children}</main>
    </div>
  );
}
