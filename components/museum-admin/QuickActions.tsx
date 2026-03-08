'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusCircle, Calendar, QrCode, BarChart3, ArrowRight } from 'lucide-react';

interface QuickActionsProps {
  museumCount: number;
}

const actions = [
  {
    title: 'Create Museum',
    description: 'Add a new listing',
    href: '/museum-admin/museums/create',
    icon: PlusCircle,
    primary: true,
    glow: 'bg-primary',
  },
  {
    title: 'View Bookings',
    description: 'Manage reservations',
    href: '/museum-admin/bookings',
    icon: Calendar,
    primary: false,
    glow: 'bg-blue-500',
  },
  {
    title: 'Check-in',
    description: 'Scan visitor QR codes',
    href: '/museum-admin/check-in',
    icon: QrCode,
    primary: false,
    glow: 'bg-emerald-500',
  },
  {
    title: 'Analytics',
    description: 'View insights & trends',
    href: '/museum-admin/analytics',
    icon: BarChart3,
    primary: false,
    glow: 'bg-amber-500',
  },
];

export function QuickActions({ museumCount }: QuickActionsProps) {
  return (
    <div className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/30">
        <p className="text-sm font-semibold">Quick Actions</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {museumCount === 0
            ? 'Get started by creating your first museum'
            : `Managing ${museumCount} museum${museumCount > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Actions */}
      <div className="p-3 space-y-1.5">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={action.href}
                className={[
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 overflow-hidden',
                  action.primary
                    ? 'bg-primary text-primary-foreground hover:brightness-110 shadow-[0_2px_12px_rgba(var(--primary-rgb),0.3)]'
                    : 'hover:bg-muted/50 text-foreground/80 hover:text-foreground border border-transparent hover:border-border/40',
                ].join(' ')}
              >
                {/* Glow on non-primary hover */}
                {!action.primary && (
                  <div className={`absolute -top-4 -left-4 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity ${action.glow}`} />
                )}

                {/* Icon */}
                <div className={[
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all',
                  action.primary
                    ? 'bg-primary-foreground/15'
                    : `bg-muted/60 group-hover:${action.glow} group-hover:bg-opacity-10`,
                ].join(' ')}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{action.title}</p>
                  <p className={`text-[11px] mt-0.5 truncate ${action.primary ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {action.description}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className={[
                  'w-3.5 h-3.5 shrink-0 transition-all duration-200',
                  action.primary
                    ? 'text-primary-foreground/60'
                    : 'text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-0.5',
                ].join(' ')} />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}