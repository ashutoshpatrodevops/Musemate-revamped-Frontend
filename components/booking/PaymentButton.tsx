// components/booking/PaymentButton.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { api, endpoints, type ApiResponse } from '@/lib/api';
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
  const { getToken, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const getFreshToken = async () => {
    // Always get a fresh token so long payment interactions don't fail auth.
    const token = await getToken({ skipCache: true });
    if (!token) {
      throw new Error('No authentication token available');
    }
    return token;
  };

  const isAuthError = (errorMessage?: string) => {
    if (!errorMessage) return false;
    const message = errorMessage.toLowerCase();
    return (
      message.includes('invalid authentication token') ||
      message.includes('jwt is expired') ||
      message.includes('token expired') ||
      message.includes('unauthorized')
    );
  };

  const postWithFreshTokenRetry = async <T,>(endpoint: string, payload: unknown): Promise<ApiResponse<T>> => {
    const firstToken = await getFreshToken();
    const firstTry = await api.post<T>(endpoint, payload, firstToken);

    if (!firstTry.success && isAuthError(firstTry.error)) {
      const retryToken = await getFreshToken();
      return api.post<T>(endpoint, payload, retryToken);
    }

    return firstTry;
  };

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

      // Create booking and get Razorpay order
      const response = await postWithFreshTokenRetry<CreateBookingResponse>(
        endpoints.bookings.create,
        bookingData
      );

      if (!response.success || !response.data) {
        if (isAuthError(response.error)) {
          toast.error('Session expired. Please sign in again.');
          router.push('/sign-in');
          setLoading(false);
          return;
        }

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
            const verifyResponse = await postWithFreshTokenRetry(
              endpoints.bookings.verifyPayment,
              {
                bookingId: booking._id,
                razorpayOrderId: razorpayResponse.razorpay_order_id,
                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                razorpaySignature: razorpayResponse.razorpay_signature,
              }
            );

            if (verifyResponse.success) {
              toast.success('Payment successful! Redirecting...');
              router.push(`/bookings/${booking._id}/confirmation`);
            } else {
              if (isAuthError(verifyResponse.error)) {
                toast.error('Session expired while verifying payment. Please sign in and retry.');
                router.push('/sign-in');
                setLoading(false);
                return;
              }

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