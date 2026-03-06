// app/dashboard/visits/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { VisitCard } from '@/components/dashboard/VisitCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api, endpoints } from '@/lib/api';
import { Booking } from '@/types';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function VisitsPage() {
  const { getToken } = useAuth();
  const [upcomingVisits, setUpcomingVisits] = useState<Booking[]>([]);
  const [completedVisits, setCompletedVisits] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in to view visits');
        return;
      }

      const response = await api.get<Booking[]>(
        endpoints.bookings.upcoming,
        token
      );

      if (response.success && response.data) {
        const now = new Date();
        const upcoming: Booking[] = [];
        const completed: Booking[] = [];

        response.data.forEach((booking) => {
          const visitDate = new Date(booking.visitDate);
          if (visitDate >= now && booking.status === 'confirmed') {
            upcoming.push(booking);
          } else if (booking.status === 'completed') {
            completed.push(booking);
          }
        });

        setUpcomingVisits(upcoming);
        setCompletedVisits(completed);
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
      toast.error('Failed to load visits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="My Visits"
        description="Track your upcoming and past museum visits"
      />

      <div className="p-4 md:p-6">
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingVisits.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedVisits.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Visits */}
          <TabsContent value="upcoming" className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : upcomingVisits.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No upcoming visits"
                description="You don't have any upcoming museum visits scheduled"
                actionLabel="Book a Visit"
                actionHref="/museums"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingVisits.map((booking) => (
                  <VisitCard key={booking._id} booking={booking} type="upcoming" />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Completed Visits */}
          <TabsContent value="completed" className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : completedVisits.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No completed visits"
                description="Your past museum visits will appear here"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedVisits.map((booking) => (
                  <VisitCard key={booking._id} booking={booking} type="completed" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}