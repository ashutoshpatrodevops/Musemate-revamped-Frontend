// components/museum-admin/MuseumAdminMobileSidebar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  Building2,
  Calendar,
  QrCode,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Store,
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
    label: 'Analytics',
    href: '/museum-admin/analytics',
    icon: BarChart3,
  },
  // {
  //   label: 'Settings',
  //   href: '/museum-admin/settings',
  //   icon: Settings,
  // },
];

export function MuseumAdminMobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span>Museum Admin</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="my-2 border-t" />

          <button
            onClick={() => {
              signOut();
              setOpen(false);
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}