// components/museum-admin/RecentBookings.tsx
'use client';

import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const statusConfig: Record<string, { dot: string; text: string }> = {
  confirmed: { dot: 'bg-emerald-500', text: 'text-emerald-600' },
  completed: { dot: 'bg-blue-500',    text: 'text-blue-600' },
  pending:   { dot: 'bg-amber-500',   text: 'text-amber-600' },
  cancelled: { dot: 'bg-rose-500',    text: 'text-rose-600' },
};

export function RecentBookings({ museums }: { museums: any[] }) {
  const bookings = museums.flatMap(m => m.recentBookings || []).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold">Recent Bookings</p>
            <p className="text-xs text-muted-foreground">Last {bookings.length} reservations</p>
          </div>
        </div>
        <Link
          href="/museum-admin/bookings"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors group"
        >
          View all
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-border/20">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-muted-foreground gap-2">
            <Calendar className="w-7 h-7 opacity-20" />
            <p className="text-xs">No bookings yet</p>
          </div>
        ) : (
          bookings.map((b: any, i: number) => {
            const status = statusConfig[b.status] ?? { dot: 'bg-muted-foreground', text: 'text-muted-foreground' };
            return (
              <motion.div
                key={b._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors"
              >
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar initial */}
                  <div className="w-8 h-8 rounded-xl bg-primary/8 border border-border/30 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                    {(b.user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight truncate">
                      {b.user?.username || 'Unknown'}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {b.museum?.title || 'Unknown Museum'}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end shrink-0 ml-3">
                  <p className="text-sm font-semibold">
                    ₹{(b.totalAmount || 0).toLocaleString('en-IN')}
                  </p>
                  <span className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${status.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {b.status}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}