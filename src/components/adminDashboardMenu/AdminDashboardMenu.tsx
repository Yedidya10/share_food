'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Shapes, Users } from 'lucide-react'

const navItems = [
  { label: 'Users', icon: <Users />, href: '/admin-dashboard/users' },
  { label: 'Items', icon: <Shapes />, href: '/admin-dashboard/items' },
]

export default function AdminDashboardMenu({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <>
      <nav className="w-full md:w-64 bg-gray-100 p-4 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 space-x-4',
                  pathname === item.href ? 'bg-gray-200 dark:bg-gray-700' : '',
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="w-full">{children}</main>
    </>
  )
}
