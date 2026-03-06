// app/dashboard/payments/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PaymentCard } from '@/components/dashboard/PaymentCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { api, endpoints } from '@/lib/api';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface Payment {
  _id: string;
  bookingReference: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
  razorpayPaymentId: string;
  createdAt: string;
  museumName?: string;
}

export default function PaymentsPage() {
  const { getToken } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in to view payments');
        return;
      }

      const response = await api.get(endpoints.bookings.myBookings, token);
      if (!response.success || !response.data) {
        toast.error(response.error || 'Failed to load payment history');
        return;
      }

      const paymentRecords: Payment[] = (response.data as any[])
        .filter((booking) => booking?.payment?.status)
        .map((booking) => {
          const paymentStatus = booking.payment?.status === 'completed' ? 'success' : 'pending';

          return {
            _id: booking._id,
            bookingReference: booking.bookingReference,
            amount: booking.totalAmount,
            status: paymentStatus,
            paymentMethod: booking.payment?.paymentMethod || 'Razorpay',
            razorpayPaymentId: booking.payment?.razorpayPaymentId || 'N/A',
            createdAt: booking.payment?.paidAt || booking.createdAt,
            museumName: booking.museum?.title || 'Museum Visit',
          };
        });

      setPayments(paymentRecords);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Payment History"
        description="View all your transactions"
      />

      <div className="p-4 md:p-6 space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payment history"
            description="Your payment transactions will appear here once you make bookings"
            actionLabel="Browse Museums"
            actionHref="/museums"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {payments.map((payment) => (
              <PaymentCard key={payment._id} payment={payment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}