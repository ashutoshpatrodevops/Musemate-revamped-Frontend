'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { museumAdminApi } from '@/lib/museum-admin';
import { Museum, MuseumStats } from '@/types';
import { StatsCards } from '@/components/museum-admin/MuseumStatsCard';
import { RecentBookings } from '@/components/museum-admin/RecentBookings';
import { QuickActions } from '@/components/museum-admin/QuickActions';
import { RevenueChart } from '@/components/museum-admin/RevenueChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AggregateStats {
  totalRevenue: number;
  totalBookings: number;
  totalVisitors: number;
  activeMuseums: number;
  averageRating: number;
}

export default function MuseumAdminDashboard() {
  const { getToken } = useAuth();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [aggregateStats, setAggregateStats] = useState<AggregateStats>({
    totalRevenue: 0,
    totalBookings: 0,
    totalVisitors: 0,
    activeMuseums: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Get all museums
      const museumsRes = await museumAdminApi.getMyMuseums(token);

      if (!museumsRes.success || !museumsRes.data) {
        setError(museumsRes.message || 'Failed to load museums');
        return;
      }

      const museumsData = museumsRes.data.data || [];
      setMuseums(museumsData);

      // Get stats for each museum
      const statsPromises = museumsData.map((museum) =>
        museumAdminApi.getMuseumStats(museum._id, token)
      );

      const statsResults = await Promise.all(statsPromises);

      // Aggregate stats
      const totals = statsResults.reduce(
        (acc, result) => {
          if (result.success && result.data) {
            acc.totalRevenue += result.data.totalRevenue || 0;
            acc.totalBookings += result.data.totalBookings || 0;
            acc.totalVisitors += result.data.totalVisitors || 0;
            acc.totalRating += result.data.averageRating || 0;
            acc.count++;
          }
          return acc;
        },
        {
          totalRevenue: 0,
          totalBookings: 0,
          totalVisitors: 0,
          totalRating: 0,
          count: 0,
        }
      );

      setAggregateStats({
        totalRevenue: totals.totalRevenue,
        totalBookings: totals.totalBookings,
        totalVisitors: totals.totalVisitors,
        activeMuseums: museumsData.filter((m) => m.status === 'active').length,
        averageRating: totals.count > 0 ? totals.totalRating / totals.count : 0,
      });
    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your museums.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={aggregateStats} />

      {/* Charts & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart museums={museums} />
        <QuickActions museumCount={museums.length} />
      </div>

      {/* Recent Bookings */}
      <RecentBookings museums={museums} />
    </div>
  );
}