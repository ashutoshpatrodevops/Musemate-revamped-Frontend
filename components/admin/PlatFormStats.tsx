'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

type PlatformStats = {
  totalMuseums: number;
  activeMuseums: number;
  pendingMuseums: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
};

export default function PlatformStats() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/museums/admin/platform-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('Failed to fetch platform stats');

        const payload = await res.json();
        setStats(payload.data ?? payload);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: 'Total Museums', value: stats.totalMuseums },
    { label: 'Active Museums', value: stats.activeMuseums },
    { label: 'Pending Museums', value: stats.pendingMuseums },
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Total Bookings', value: stats.totalBookings },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}` },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
