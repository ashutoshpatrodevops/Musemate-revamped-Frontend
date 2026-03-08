'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { museumAdminApi } from '@/lib/museum-admin';
import { Museum } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { MuseumCard } from '@/components/museum-admin/MuseumCard';
import { EmptyState } from '@/components/museum-admin/EmptyState';
import { motion } from 'framer-motion';
import { PlusCircle, Search, AlertCircle, Building2 } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function MuseumsPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [filteredMuseums, setFilteredMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { loadMuseums(); }, []);
  useEffect(() => { filterMuseums(); }, [searchQuery, statusFilter, museums]);

  const loadMuseums = async () => {
    try {
      setLoading(true); setError(null);
      const token = await getToken();
      if (!token) { setError('Authentication required'); return; }

      const response = await museumAdminApi.getMyMuseums(token);
      if (!response.success || !response.data) {
        setError(response.message || 'Failed to load museums'); return;
      }
      const data = response.data.data || [];
      setMuseums(data); setFilteredMuseums(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load museums');
    } finally {
      setLoading(false);
    }
  };

  const filterMuseums = () => {
    let f = [...museums];
    if (searchQuery)
      f = f.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    if (statusFilter !== 'all') f = f.filter(m => m.status === statusFilter);
    setFilteredMuseums(f);
  };

  const handleDeleteMuseum = async (museumId: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      const response = await museumAdminApi.deleteMuseum(museumId, token);
      if (response.success) setMuseums(prev => prev.filter(m => m._id !== museumId));
    } catch (err: any) {
      console.error('Error deleting museum:', err);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48 rounded-xl" />
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>
      <Skeleton className="h-11 w-full rounded-xl" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
      </div>
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

      {/* ── Header ── */}
      <motion.div {...fadeUp(0)} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Museums</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your listings and track performance
          </p>
        </div>

        <Button
          onClick={() => router.push('/museum-admin/museums/create')}
          size="sm"
          className="h-9 rounded-xl gap-1.5 text-xs font-semibold shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Create Museum
        </Button>
      </motion.div>

      {/* ── Filters — only shown when museums exist ── */}
      {museums.length > 0 && (
        <motion.div
          {...fadeUp(0.08)}
          className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by name or city…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-xl border-border/50 bg-background/80 text-sm focus:border-primary/40"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[180px] rounded-xl border-border/50 text-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
            </SelectContent>
          </Select>

          {/* Result count */}
          <span className="sm:self-center text-xs text-muted-foreground shrink-0">
            {filteredMuseums.length} of {museums.length}
          </span>
        </motion.div>
      )}

      {/* ── Content ── */}
      {filteredMuseums.length === 0 ? (
        <motion.div {...fadeUp(0.12)}>
          <EmptyState
            icon={<Building2 className="w-6 h-6" />}
            title={museums.length === 0 ? 'No museums yet' : 'No museums found'}
            description={
              museums.length === 0
                ? 'Create your first museum to start accepting bookings'
                : 'Try adjusting your search or filters'
            }
            actionLabel={museums.length === 0 ? 'Create Museum' : undefined}
            onAction={museums.length === 0 ? () => router.push('/museum-admin/museums/create') : undefined}
          />
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredMuseums.map(museum => (
            <motion.div
              key={museum._id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <MuseumCard
                museum={museum}
                onDelete={handleDeleteMuseum}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

    </div>
  );
}