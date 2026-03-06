// components/museum-admin/MuseumAdminSidebar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../layouts/ThemeToggle';
import {
  Building2,
  Calendar,
  QrCode,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store,
  PersonStanding
} from 'lucide-react';

const menuItems = [
  {
    label: 'My Museums',
    href: '/museum-admin/museums',
    icon: Building2,
  },
  {
    label: 'Bookings',
    href: '/museum-admin/bookings',
    icon: Calendar,
  },
  {
    label: 'Check-in',
    href: '/museum-admin/check-in',
    icon: QrCode,
  },
  {
    label: 'Reviews',
    href: '/museum-admin/reviews',
    icon: MessageSquare,
  },
  {
    label: 'DashBoard',
    href: '/museum-admin',
    icon: Settings,
  },
  {
    label: 'Analytics',
    href: '/museum-admin/analytics',
    icon: BarChart3,
  },
  {
    label: 'My profile',
    href: '/dashboard/bookings',
    icon: PersonStanding,
  },

  // {
  //   label: 'Settings',
  //   href: '/museum-admin/settings',
  //   icon: Settings,
  // },
];

export function MuseumAdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo & Toggle */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link href="/museum-admin" className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Museum Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(collapsed && 'mx-auto')}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
         {menuItems.map((item) => {
  const Icon = item.icon;

  const isActive =
    item.href === '/museum-admin'
      ? pathname === '/museum-admin'
      : pathname === item.href || pathname.startsWith(item.href + '/');

  return (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        collapsed && 'justify-center'
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
})}


          {/* Divider */}
          <div className="my-2 border-t" />

          {/* Logout */}
          <button
            onClick={() => signOut()}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-destructive hover:text-destructive-foreground',
              collapsed && 'justify-center'
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>
            <ThemeToggle />
        {/* Footer */}
        {!collapsed && (
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground text-center">
              © 2026 MuseMate Admin
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}