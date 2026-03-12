'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

type Booking = {
  _id: string;
  user?: {
    username?: string;
    email?: string;
  };
  museum?: {
    title?: string;
  };
  visitDate: string;
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  totalVisitors: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
};

export function BookingsAdminTable() {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await res.json();
      // Extract array from response: { success, data: Booking[] } or { success, data: { data: Booking[] } }
      const bookingsData = Array.isArray(payload.data) ? payload.data : (payload.data?.data || payload);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Bookings</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Museum</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>
                    {booking.user?.username || booking.user?.email || 'User'}
                  </TableCell>
                  <TableCell>{booking.museum?.title || 'Museum'}</TableCell>
                  <TableCell>
                    {new Date(booking.visitDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}
                  </TableCell>
                  <TableCell>{booking.totalVisitors}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        booking.status === 'confirmed'
                          ? 'success'
                          : booking.status === 'completed'
                          ? 'success'
                          : booking.status === 'cancelled'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
