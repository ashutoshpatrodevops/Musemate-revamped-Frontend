'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { museumAdminApi } from '@/lib/museum-admin';
import { Booking, Museum } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Calendar, Users, IndianRupee,
  Eye, Download, Filter, AlertCircle,
  Hash, Clock, Phone, Mail, User,
  CheckCircle2, TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';

/* ── helpers ── */
const statusConfig: Record<string, { dot: string; pill: string }> = {
  confirmed: { dot: 'bg-emerald-500', pill: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  completed: { dot: 'bg-blue-500',    pill: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  pending:   { dot: 'bg-amber-500',   pill: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  cancelled: { dot: 'bg-rose-500',    pill: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
};

function StatusPill({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { dot: 'bg-muted-foreground', pill: 'bg-muted text-muted-foreground border-border' };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color, delay }: {
  icon: React.ElementType; label: string; value: string | number; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative group rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm p-5 overflow-hidden hover:border-border/70 transition-all"
    >
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity ${color}`} />
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}>
          <Icon className="w-4 h-4 text-foreground/70" />
        </div>
        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/30" />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
    </motion.div>
  );
}

const getMuseumName = (museum: any) => typeof museum === 'object' ? museum.title : 'Unknown';
const getUserName  = (user: any)   => typeof user   === 'object' ? user.username  : 'Unknown';

export default function BookingsPage() {
  const { getToken } = useAuth();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [museumFilter, setMuseumFilter] = useState('all');

  useEffect(() => { loadData(); }, []);
  useEffect(() => { filterBookings(); }, [searchQuery, statusFilter, museumFilter, allBookings]);

  const loadData = async () => {
    try {
      setLoading(true); setError(null);
      const token = await getToken();
      if (!token) { setError('Authentication required'); return; }

      const museumsRes = await museumAdminApi.getMyMuseums(token);
      if (!museumsRes.success || !museumsRes.data) { setError('Failed to load museums'); return; }
      const museumsData = museumsRes.data.data || [];
      setMuseums(museumsData);

      const results = await Promise.all(
        museumsData.map(m => museumAdminApi.getMuseumBookings(m._id, { page: 1, limit: 100 }, token))
      );
      const all = results.flatMap(r => {
        if (!r.success || !r.data) return [];
        // Handle both { data: Booking[] } and { data: { data: Booking[], stats, pagination } }
        const bookings = Array.isArray(r.data) ? r.data : (r.data?.data || []);
        return Array.isArray(bookings) ? bookings : [];
      });
      setAllBookings(all); setFilteredBookings(all);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let f = [...allBookings];
    if (searchQuery) f = f.filter(b =>
      b.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof b.user === 'object' && b.user.username?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (statusFilter !== 'all') f = f.filter(b => b.status === statusFilter);
    if (museumFilter !== 'all') f = f.filter(b =>
      (typeof b.museum === 'object' ? b.museum._id : b.museum) === museumFilter
    );
    setFilteredBookings(f);
  };

  const stats = {
    total:    allBookings.length,
    confirmed: allBookings.filter(b => b.status === 'confirmed').length,
    completed: allBookings.filter(b => b.status === 'completed').length,
    revenue:   allBookings.filter(b => b.payment.status === 'completed').reduce((s, b) => s + b.totalAmount, 0),
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-56 rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <Skeleton className="h-[500px] rounded-2xl" />
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="m-6 flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-destructive text-sm">
      <AlertCircle className="w-4 h-4 shrink-0" /> {error}
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ── Page title ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight">All Bookings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage bookings across all your museums</p>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar}     label="Total Bookings" value={stats.total}                                          color="bg-violet-500" delay={0.05} />
        <StatCard icon={CheckCircle2} label="Confirmed"      value={stats.confirmed}                                      color="bg-emerald-500" delay={0.10} />
        <StatCard icon={Users}        label="Completed"      value={stats.completed}                                      color="bg-blue-500"   delay={0.15} />
        <StatCard icon={IndianRupee}  label="Total Revenue"  value={`₹${stats.revenue.toLocaleString('en-IN')}`}         color="bg-amber-500"  delay={0.20} />
      </div>

      {/* ── Filters ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm p-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by reference or customer…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-xl border-border/50 bg-background/80 text-sm focus:border-primary/40"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[160px] rounded-xl border-border/50 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={museumFilter} onValueChange={setMuseumFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[180px] rounded-xl border-border/50 text-sm">
              <SelectValue placeholder="Museum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Museums</SelectItem>
              {museums.map(m => <SelectItem key={m._id} value={m._id}>{m.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm overflow-hidden"
      >
        {/* table header row */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
          <p className="text-sm font-semibold">
            Bookings <span className="text-muted-foreground font-normal ml-1">({filteredBookings.length})</span>
          </p>
          <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs gap-1.5 border-border/50">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-muted-foreground gap-2">
            <Calendar className="w-8 h-8 opacity-30" />
            <p className="text-sm">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/30">
                  {['Reference', 'Museum', 'Customer', 'Visit Date', 'Visitors', 'Amount', 'Status', ''].map(h => (
                    <TableHead key={h} className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 h-10">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking, i) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="group border-border/20 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground py-3.5">
                      {booking.bookingReference}
                    </TableCell>
                    <TableCell className="text-sm font-medium py-3.5 max-w-[140px] truncate">
                      {getMuseumName(booking.museum)}
                    </TableCell>
                    <TableCell className="text-sm py-3.5">{getUserName(booking.user)}</TableCell>
                    <TableCell className="py-3.5">
                      <p className="text-sm">{format(new Date(booking.visitDate), 'MMM dd, yyyy')}</p>
                      <p className="text-[11px] text-muted-foreground">{booking.timeSlot.startTime} – {booking.timeSlot.endTime}</p>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className="flex items-center gap-1 text-sm">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        {booking.totalVisitors}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-semibold py-3.5">
                      ₹{booking.totalAmount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <StatusPill status={booking.status} />
                    </TableCell>
                    <TableCell className="py-3.5 text-right">
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedBooking(booking); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted ml-auto"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* ── Detail Dialog ── */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-xl rounded-2xl border-border/40 bg-background/90 backdrop-blur-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base font-bold">Booking Details</DialogTitle>
            <p className="text-xs font-mono text-muted-foreground">{selectedBooking?.bookingReference}</p>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 text-sm">

              {/* Status + Museum */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/30 bg-muted/20">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Museum</p>
                  <p className="font-semibold">{getMuseumName(selectedBooking.museum)}</p>
                </div>
                <StatusPill status={selectedBooking.status} />
              </div>

              {/* Visit info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Calendar, label: 'Visit Date', value: format(new Date(selectedBooking.visitDate), 'MMMM dd, yyyy') },
                  { icon: Clock,    label: 'Time Slot',  value: `${selectedBooking.timeSlot.startTime} – ${selectedBooking.timeSlot.endTime}` },
                  { icon: Users,    label: 'Visitors',   value: `${selectedBooking.totalVisitors} visitors` },
                  { icon: Hash,     label: 'Reference',  value: selectedBooking.bookingReference },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-3 rounded-xl border border-border/30 bg-muted/10">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Icon className="w-3 h-3" />
                      <p className="text-[10px] font-semibold uppercase tracking-widest">{label}</p>
                    </div>
                    <p className="font-medium text-xs">{value}</p>
                  </div>
                ))}
              </div>

              {/* Visitors list */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Visitor Details</p>
                <div className="space-y-1.5">
                  {selectedBooking.visitors.map((v, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl border border-border/30 bg-muted/10">
                      <span className="text-xs">{v.name} · {v.age} yrs</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/15">
                        {v.ticketType}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Contact</p>
                <div className="space-y-1.5">
                  {[
                    { icon: User,  value: selectedBooking.contactInfo.name },
                    { icon: Phone, value: selectedBooking.contactInfo.phone },
                    { icon: Mail,  value: selectedBooking.contactInfo.email },
                  ].map(({ icon: Icon, value }) => (
                    <div key={value} className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-2 rounded-xl border border-border/20 bg-muted/10">
                      <Icon className="w-3 h-3 shrink-0" /> {value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-xl border border-border/30 bg-muted/10 overflow-hidden">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-4 pt-3 pb-2">Payment Breakdown</p>
                <div className="divide-y divide-border/20">
                  {[
                    { label: 'Subtotal',     value: selectedBooking.subtotal },
                    { label: 'Tax (18%)',    value: selectedBooking.tax },
                    { label: 'Platform Fee', value: selectedBooking.platformFee },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between px-4 py-2 text-xs text-muted-foreground">
                      <span>{label}</span>
                      <span>₹{value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-4 py-3 font-bold text-sm">
                    <span>Total</span>
                    <span>₹{selectedBooking.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {selectedBooking.specialRequirements && (
                <div className="px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-700 dark:text-amber-400">
                  <p className="font-semibold mb-0.5">Special Requirements</p>
                  {selectedBooking.specialRequirements}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}