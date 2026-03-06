// components/dashboard/CancelBookingDialog.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Booking } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { api, endpoints } from '@/lib/api';
import { AlertTriangle, InfoIcon } from 'lucide-react';
import { toast } from 'sonner';

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
  onSuccess: () => void;
}

export function CancelBookingDialog({
  open,
  onOpenChange,
  booking,
  onSuccess,
}: CancelBookingDialogProps) {
  const { getToken } = useAuth();
  const [reason, setReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Calculate refund amount
  const calculateRefund = () => {
    const visitDate = new Date(booking.visitDate);
    const now = new Date();
    const hoursUntilVisit = (visitDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilVisit >= 48) {
      return { amount: booking.totalAmount, percentage: 100 };
    } else if (hoursUntilVisit >= 24) {
      return { amount: booking.totalAmount * 0.5, percentage: 50 };
    } else {
      return { amount: 0, percentage: 0 };
    }
  };

  const refund = calculateRefund();
  const isPastBooking = new Date(booking.visitDate) < new Date();

  const handleCancel = async () => {
    if (isPastBooking) {
      toast.error('Cannot cancel past bookings');
      return;
    }

    setCancelling(true);

    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in to cancel booking');
        return;
      }

      const response = await api.post(
        endpoints.bookings.cancel(booking._id),
        { reason: reason.trim() || 'Cancelled by user' },
        token
      );

      if (response.success) {
        toast.success(response.message || 'Booking cancelled successfully');
        onSuccess();
      } else {
        toast.error(response.error || 'Failed to cancel booking');
      }
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this booking?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Booking Details */}
          <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking Reference:</span>
              <span className="font-medium">{booking.bookingReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Visit Date:</span>
              <span className="font-medium">
                {formatDate(booking.visitDate, 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>

          {/* Refund Policy */}
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Cancellation Policy:</p>
              <ul className="text-sm space-y-1">
                <li>• 48+ hours before visit: 100% refund</li>
                <li>• 24-48 hours before visit: 50% refund</li>
                <li>• Less than 24 hours: No refund</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Refund Amount */}
          {!isPastBooking && (
            <Alert variant={refund.percentage > 0 ? 'default' : 'destructive'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {refund.percentage > 0 ? (
                  <>
                    <p className="font-semibold">
                      You will receive a {refund.percentage}% refund
                    </p>
                    <p className="text-sm mt-1">
                      Refund amount: {formatCurrency(refund.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Refunds are processed within 5-7 business days
                    </p>
                  </>
                ) : (
                  <p>
                    No refund applicable. Cancellation is less than 24 hours before visit.
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Cancellation Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Cancellation Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Tell us why you're cancelling..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={cancelling}
          >
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={cancelling || isPastBooking}
          >
            {cancelling ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}