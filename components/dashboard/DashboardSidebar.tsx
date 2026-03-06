// components/dashboard/DashboardSidebar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  User,
  Calendar,
  Heart,
  CreditCard,
  MapPin,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Star,
  PlusCircle,
} from 'lucide-react';

const menuItems = [
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    label: 'My Bookings',
    href: '/dashboard/bookings',
    icon: Calendar,
  },
  {
    label: 'Watchlist',
    href: '/dashboard/watchlist',
    icon: Heart,
  },
  {
    label: 'Payments',
    href: '/dashboard/payments',
    icon: CreditCard,
  },
  {
    label: 'My Visits',
    href: '/dashboard/visits',
    icon: MapPin,
  },
  {
    label: 'My Reviews',
    href: '/dashboard/reviews',
    icon: Star,
  },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 hidden h-screen border-r bg-background shadow-sm transition-all duration-300 md:flex',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo & Toggle */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <Ticket className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">MuseMate</span>
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
            const isActive = pathname === item.href;

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

          {/* List Your Museum - Highlighted Button */}
          <Link
            href="/museum-admin/museums/"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
              'text-foreground hover:bg-primary/90 hover:shadow-md hover:text-white',
              collapsed && 'justify-center'
            )}
            title={collapsed ? 'Musemate-Collaborate' : undefined}
          >
            <PlusCircle className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Musemate-Collaborate</span>}
          </Link>

          {/* Browse Museums */}
          <Link
            href="/museums"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              collapsed && 'justify-center'
            )}
            title={collapsed ? 'Browse Museums' : undefined}
          >
            <Building2 className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Browse Museums</span>}
          </Link>

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

        {/* Footer */}
        {!collapsed && (
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground text-center">
              © 2026 MuseMate
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}