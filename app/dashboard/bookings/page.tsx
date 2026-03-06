// app/dashboard/bookings/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { api, endpoints } from '@/lib/api';
import { Booking } from '@/types';
import { Calendar, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function BookingsPage() {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in to view bookings');
        return;
      }

      const response = await api.get<Booking[]>(
        endpoints.bookings.myBookings,
        token
      );

      if (response.success && response.data) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const museum = typeof booking.museum === 'object' ? booking.museum : null;
    const searchLower = searchQuery.toLowerCase();
    return (
      museum?.title.toLowerCase().includes(searchLower) ||
      booking.bookingReference.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <DashboardHeader
        title="My Bookings"
        description="View and manage your museum bookings"
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings by museum name or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={searchQuery ? 'No bookings found' : 'No bookings yet'}
            description={
              searchQuery
                ? 'Try adjusting your search query'
                : "You haven't made any bookings yet. Start exploring museums!"
            }
            actionLabel="Browse Museums"
            actionHref="/museums"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} onCancelled={fetchBookings} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}