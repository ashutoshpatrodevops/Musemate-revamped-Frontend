// app/dashboard/watchlist/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { WatchlistCard } from '@/components/dashboard/WatchlistCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { api, endpoints } from '@/lib/api';
import { Museum } from '@/types';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function WatchlistPage() {
  const { getToken } = useAuth();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in to view watchlist');
        return;
      }

      const response = await api.get<Museum[]>(endpoints.users.watchlist, token);
      if (!response.success || !response.data) {
        toast.error(response.error || 'Failed to load watchlist');
        return;
      }

      setMuseums(response.data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (museumId: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in');
        return;
      }

      const response = await api.delete(endpoints.users.removeFromWatchlist(museumId), token);
      if (!response.success) {
        toast.error(response.error || 'Failed to remove from watchlist');
        return;
      }

      setMuseums((prev) => prev.filter((m) => m._id !== museumId));
      toast.success('Removed from watchlist');
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist');
    }
  };

  return (
    <div>
      <DashboardHeader
        title="My Watchlist"
        description="Museums you've saved for later"
      />

      <div className="p-4 md:p-6 space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : museums.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No saved museums"
            description="Start building your watchlist by saving museums you'd like to visit!"
            actionLabel="Browse Museums"
            actionHref="/museums"
          />
        ) : (
          <div className="space-y-4">
            {museums.map((museum) => (
              <WatchlistCard
                key={museum._id}
                museum={museum}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}