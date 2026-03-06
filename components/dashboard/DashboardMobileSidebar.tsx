// components/dashboard/DashboardMobileSidebar.tsx

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
  User,
  Calendar,
  Heart,
  CreditCard,
  MapPin,
  Building2,
  LogOut,
  Menu,
  Ticket,
  Star,
  PlusCircle
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
    icon: Star, // Import from lucide-react
  },
];

export function DashboardMobileSidebar() {
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
            <Ticket className="h-6 w-6 text-primary" />
            <span>MuseMate</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

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

          <Link
            href="/museum-admin/museums/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PlusCircle className="h-5 w-5 flex-shrink-0" />
            <span>Musemate-Collaborate</span>
          </Link>

          <Link
            href="/museums"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Building2 className="h-5 w-5 flex-shrink-0" />
            <span>Browse Museums</span>
          </Link>

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