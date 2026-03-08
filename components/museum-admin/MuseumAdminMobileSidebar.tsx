// components/museum-admin/MuseumAdminMobileSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Building2, Calendar, QrCode,
  MessageSquare, BarChart3, LogOut,
} from 'lucide-react';

const bottomItems = [
  { label: 'Museums',   href: '/museum-admin/museums',   icon: Building2 },
  { label: 'Bookings',  href: '/museum-admin/bookings',  icon: Calendar },
  { label: 'Check-in',  href: '/museum-admin/check-in',  icon: QrCode },
  { label: 'Reviews',   href: '/museum-admin/reviews',   icon: MessageSquare },
  { label: 'Analytics', href: '/museum-admin/analytics', icon: BarChart3 },
];

export function MuseumAdminMobileSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div
        className="flex items-center justify-around px-2 py-2 rounded-2xl
                   border border-white/10
                   bg-background/60 backdrop-blur-xl
                   shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl group"
            >
              {/* Active pill */}
              {isActive && (
                <motion.div
                  layoutId="admin-bottom-active"
                  className="absolute inset-0 rounded-xl bg-primary/12"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <Icon className={cn(
                'h-5 w-5 transition-colors relative z-10',
                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              )} />

              <span className={cn(
                'text-[9px] font-semibold tracking-wide relative z-10 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground/60 group-hover:text-foreground'
              )}>
                {item.label}
              </span>

              {/* Active dot */}
              {isActive && (
                <motion.span
                  layoutId="admin-bottom-dot"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={() => signOut()}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl group"
        >
          <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-destructive transition-colors" />
          <span className="text-[9px] font-semibold tracking-wide text-muted-foreground/60 group-hover:text-destructive transition-colors">
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}