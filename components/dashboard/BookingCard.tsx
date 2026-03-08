// components/dashboard/BookingCard.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Booking } from '@/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { CancelBookingDialog } from './CancelBookingDialog';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Download,
  Eye, X, Ticket, Hash, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { endpoints } from '@/lib/api';
import { toast } from 'sonner';

interface BookingCardProps {
  booking: Booking;
  onCancelled?: () => void;
}

/* ── status config ── */
const statusConfig: Record<string, { dot: string; pill: string; label: string }> = {
  confirmed: {
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    label: 'Confirmed',
  },
  pending: {
    dot: 'bg-amber-500',
    pill: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    label: 'Pending',
  },
  cancelled: {
    dot: 'bg-rose-500',
    pill: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    label: 'Cancelled',
  },
  completed: {
    dot: 'bg-blue-500',
    pill: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    label: 'Completed',
  },
};

export function BookingCard({ booking, onCancelled }: BookingCardProps) {
  const { getToken } = useAuth();
  const museum = typeof booking.museum === 'object' ? booking.museum : null;
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const status = statusConfig[booking.status] ?? {
    dot: 'bg-muted-foreground',
    pill: 'bg-muted text-muted-foreground border-border',
    label: booking.status,
  };

  const handleDownloadTicket = async () => {
    setDownloading(true);
    try {
      const token = await getToken();
      if (!token) { toast.error('Please sign in to download ticket'); return; }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoints.bookings.download(booking._id)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Failed to download ticket');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${booking.bookingReference}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Ticket downloaded!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to download ticket');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="group relative rounded-2xl border border-border/40 bg-background/70 backdrop-blur-sm overflow-hidden hover:border-border/70 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
      >
        {/* Left accent bar — color matches status */}
        <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full ${status.dot} opacity-60`} />

        {/* ── Main content ── */}
        <div className="px-6 py-5 pl-8">

          {/* Top row: title + status */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-base leading-tight truncate mb-1">
                {museum?.title || 'Museum'}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{museum?.location}</span>
              </div>
            </div>

            {/* Status pill */}
            <span className={`inline-flex items-center gap-1.5 shrink-0 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${status.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(booking.visitDate, 'MMM dd, yyyy')}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {booking.timeSlot.startTime} – {booking.timeSlot.endTime}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span className="font-mono">{booking.bookingReference}</span>
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/30 mb-4" />

          {/* Bottom row: price + actions */}
          <div className="flex items-center justify-between gap-3">
            {/* Amount */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                Total
              </p>
              <p className="text-xl font-bold tracking-tight">
                {formatCurrency(booking.totalAmount)}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* View details */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 rounded-xl text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              >
                <Link href={`/bookings/${booking._id}/confirmation`}>
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Link>
              </Button>

              <AnimatePresence>
                {booking.status === 'confirmed' && (
                  <>
                    {/* Download */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadTicket}
                        disabled={downloading}
                        className="h-8 rounded-xl text-xs gap-1.5 border-border/50 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                      >
                        {downloading ? (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-current/30 border-t-current animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        Ticket
                      </Button>
                    </motion.div>

                    {/* Cancel */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCancelDialog(true)}
                        className="h-8 w-8 rounded-xl p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/8"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Hover right-arrow hint */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none">
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </motion.div>

      <CancelBookingDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        booking={booking}
        onSuccess={() => {
          setShowCancelDialog(false);
          onCancelled?.();
        }}
      />
    </>
  );
}