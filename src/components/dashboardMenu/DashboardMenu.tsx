"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Profile', href: '/dashboard/profile' },
  { label: 'My Items', href: '/dashboard/my-items' },
  { label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardMenu({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <nav className="w-full md:w-64 bg-gray-100 p-4 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
                  pathname === item.href && 'bg-gray-300 font-semibold'
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
