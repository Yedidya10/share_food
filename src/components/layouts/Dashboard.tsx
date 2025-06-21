"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import React from "react";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export default function DashboardLayout({
  navItems,
  children,
}: {
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className='flex flex-col md:flex-row'>
      {/* תפריט מובייל - עם Trigger */}
      <div className='md:hidden sticky z-50 w-full top-[60px] bg-white dark:bg-gray-900'>
        <NavigationMenu className='block max-w-full'>
          <NavigationMenuList>
            <NavigationMenuItem className='w-full'>
              <NavigationMenuTrigger className='w-full max-w-full'>
                תפריט
              </NavigationMenuTrigger>
              <NavigationMenuContent className='block max-w-full w-full'>
                <ul className='w-[calc(100vw-2rem)]'>
                  {navItems.map((item) => (
                    <li key={item.href}>
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
                            {item.icon && <span>{item.icon}</span>}
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

      {/* סיידבר מקובע לדסקטופ */}
      <aside
        className={cn(
          "hidden md:flex fixed top-[60px] inset-inline-start-0 w-[max(180px,18%)] h-[calc(100vh-60px)]",
          "bg-gray-100 border-inline-end border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        )}
      >
        <ul className='p-2 space-y-1 w-full'>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                  pathname === item.href &&
                    "bg-gray-300 font-semibold dark:bg-gray-600"
                )}
              >
                <div className='flex items-center gap-2'>
                  {item.icon && item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* תוכן ראשי */}
      <main
        className={cn(
          "flex-1 p-4 overflow-auto w-full",
          "mt-[60px] md:mt-0",
          "md:ms-[max(180px,18%)] h-[calc(100vh-60px)]"
        )}
      >
        {children}
      </main>
    </div>
  );
}
