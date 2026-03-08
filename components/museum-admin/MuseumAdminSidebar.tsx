// components/museum-admin/MuseumAdminSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../layouts/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Calendar, QrCode, MessageSquare,
  BarChart3, Settings, LogOut, ChevronLeft,
  ChevronRight, Store, PersonStanding,
} from 'lucide-react';

const menuItems = [
  { label: 'My Museums', href: '/museum-admin/museums',  icon: Building2 },
  { label: 'Bookings',   href: '/museum-admin/bookings', icon: Calendar },
  { label: 'Check-in',   href: '/museum-admin/check-in', icon: QrCode },
  { label: 'Reviews',    href: '/museum-admin/reviews',  icon: MessageSquare },
  { label: 'Dashboard',  href: '/museum-admin',          icon: Settings },
  { label: 'Analytics',  href: '/museum-admin/analytics',icon: BarChart3 },
  { label: 'My Profile', href: '/dashboard/bookings',    icon: PersonStanding },
];

export function MuseumAdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <div
      className={cn(
        'fixed left-3 top-4 bottom-4 z-40 hidden md:flex flex-col transition-all duration-300',
        collapsed ? 'w-[64px]' : 'w-[250px]'
      )}
    >
      {/* ── Floating glass rectangle ── */}
      <div className="relative flex flex-col h-full rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden">

        {/* Top shimmer */}
        <div className="absolute inset-x-0 top-0 h-px pointer-events-none" />

        {/* ── Logo row ── */}
        <div className="flex h-14 items-center justify-between px-3 border-b border-white/5 shrink-0">
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Store className="h-4 w-4 text-primary" />
                </div>
                <span className="font-bold text-sm tracking-tight truncate">Admin</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setCollapsed(v => !v)}
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground',
              'hover:bg-white/8 hover:text-foreground transition-colors shrink-0',
              collapsed && 'mx-auto'
            )}
          >
            {collapsed
              ? <ChevronRight className="h-4 w-4" />
              : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 flex flex-col gap-0.5 p-2 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/museum-admin'
              ? pathname === '/museum-admin'
              : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(var(--primary-rgb),0.3)]'
                    : 'text-muted-foreground hover:bg-white/6 hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                {/* Active left bar */}
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary-foreground/60" />
                )}

                <Icon className="h-4 w-4 shrink-0" />

                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      className="truncate overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-2.5 px-2 py-1 rounded-lg bg-popover border border-border/50 text-[11px] font-medium text-popover-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="my-1.5 mx-1 h-px bg-white/5" />

          {/* Logout */}
          <button
            onClick={() => signOut()}
            title={collapsed ? 'Logout' : undefined}
            className={cn(
              'group relative w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-all duration-200',
              'text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="truncate overflow-hidden whitespace-nowrap"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
            {collapsed && (
              <span className="pointer-events-none absolute left-full ml-2.5 px-2 py-1 rounded-lg bg-popover border border-border/50 text-[11px] font-medium text-popover-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Logout
              </span>
            )}
          </button>
        </nav>

        {/* ── Footer: ThemeToggle + copyright ── */}
        <div className="shrink-0 p-2 border-t border-white/5 flex flex-col items-center gap-2">
          <ThemeToggle />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-muted-foreground/40 text-center tracking-wider"
              >
                © 2026 MuseMate Admin
              </motion.p>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}