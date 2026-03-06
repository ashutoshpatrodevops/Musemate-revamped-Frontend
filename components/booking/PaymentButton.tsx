// components/booking/PaymentButton.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { api, endpoints } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentButtonProps {
  bookingData: any;
  totalAmount: number;
  disabled?: boolean;
  onValidate?: () => boolean;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface CreateBookingResponse {
  booking: {
    _id: string;
  };
  razorpayOrder: RazorpayOrder;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PaymentButton({ 
  bookingData, 
  totalAmount, 
  disabled, 
  onValidate 
}: PaymentButtonProps) {
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth(); // ⭐ Add isSignedIn
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // ⭐ Check if user is signed in first
    if (!isSignedIn) {
      toast.error('Please sign in to continue');
      router.push('/sign-in');
      return;
    }

    // Run validation BEFORE proceeding
    if (onValidate && !onValidate()) {
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      // ⭐ Get auth token with better error handling
      let token: string | null = null;
      try {
        token = await getToken();
        console.log('Token obtained:', token ? 'Yes' : 'No'); // Debug log
      } catch (error) {
        console.error('Error getting token:', error);
        toast.error('Authentication error. Please sign in again.');
        router.push('/sign-in');
        setLoading(false);
        return;
      }

      if (!token) {
        toast.error('Please sign in to continue');
        router.push('/sign-in');
        setLoading(false);
        return;
      }

      // ⭐ Log the request for debugging
      console.log('Creating booking with data:', bookingData);
      console.log('Using token:', token.substring(0, 20) + '...');

      // Create booking and get Razorpay order
      const response = await api.post<CreateBookingResponse>(
        endpoints.bookings.create,
        bookingData,
        token
      );

      console.log('Booking response:', response); // Debug log

      if (!response.success || !response.data) {
        toast.error(response.error || 'Failed to create booking');
        setLoading(false);
        return;
      }

      const { booking, razorpayOrder } = response.data;

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'MuseMate',
        description: 'Museum Ticket Booking',
        order_id: razorpayOrder.id,
        handler: async (razorpayResponse: any) => {
          try {
            const verifyResponse = await api.post(
              endpoints.bookings.verifyPayment,
              {
                bookingId: booking._id,
                razorpayOrderId: razorpayResponse.razorpay_order_id,
                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                razorpaySignature: razorpayResponse.razorpay_signature,
              },
              token
            );

            if (verifyResponse.success) {
              toast.success('Payment successful! Redirecting...');
              router.push(`/bookings/${booking._id}/confirmation`);
            } else {
              toast.error('Payment verification failed');
              setLoading(false);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: bookingData.contactInfo.name,
          email: bookingData.contactInfo.email,
          contact: bookingData.contactInfo.phone,
        },
        theme: {
          color: '#0F172A',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handlePayment}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-5 w-5 mr-2" />
          Proceed to Payment
        </>
      )}
    </Button>
  );
}