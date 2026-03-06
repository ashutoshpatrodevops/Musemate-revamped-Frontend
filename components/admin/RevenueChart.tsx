'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type RevenueData = {
  date: string;   // e.g. "2026-01-20"
  revenue: number;
};

type Booking = {
  visitDate: string;
  totalAmount: number;
  payment?: {
    status?: string;
  };
};

export default function RevenueChart() {
  const { getToken } = useAuth();
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = await getToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings/admin/all?limit=200&sortBy=visitDate&sortOrder=asc`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('Failed to fetch revenue analytics');

        const payload = await res.json();
        const bookings: Booking[] = payload.data ?? payload ?? [];

        const revenueByDate = new Map<string, number>();
        bookings.forEach((booking) => {
          if (booking.payment?.status !== 'completed') return;
          const dateKey = new Date(booking.visitDate).toISOString().slice(0, 10);
          revenueByDate.set(
            dateKey,
            (revenueByDate.get(dateKey) ?? 0) + (booking.totalAmount || 0)
          );
        });

        const chartData = Array.from(revenueByDate.entries())
          .map(([date, revenue]) => ({ date, revenue }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setData(chartData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [getToken]);

  return (
    <Card className="h-[360px]">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>

      <CardContent className="h-[280px]">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No revenue data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
