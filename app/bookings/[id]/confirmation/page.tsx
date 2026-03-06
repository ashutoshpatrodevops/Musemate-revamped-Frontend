// app/bookings/[id]/confirmation/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, endpoints } from '@/lib/api';
import { Booking } from '@/types';
import { BookingConfirmation } from '@/components/booking/BookingConfirmation';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>(''); // ⭐ Add QR code state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    if (params.id) {
      fetchBooking();
    }
  }, [params.id, isSignedIn]);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in to view booking');
        router.push('/sign-in');
        return;
      }

      // ⭐ Updated response type to match backend
      const response = await api.get<{ booking: Booking; qrCode: string }>(
        endpoints.bookings.detail(params.id as string),
        token
      );

      // ⭐ Debug logs
      console.log('📦 Full response:', response);
      console.log('🎫 Booking data:', response.data);

      if (response.success && response.data) {
        // ⭐ Handle both response formats
        if ('booking' in response.data) {
          // Backend returns { booking, qrCode }
          setBooking(response.data.booking);
          setQrCodeData(response.data.qrCode || '');
        } else {
          // Backend returns booking directly
          setBooking(response.data as any);
          setQrCodeData('');
        }
      } else {
        toast.error('Booking not found');
        router.push('/dashboard/bookings');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
      router.push('/dashboard/bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-32 w-full mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <BookingConfirmation booking={booking} qrCodeData={qrCodeData} /> {/* ⭐ Pass qrCodeData */}
    </div>
  );
}