// components/dashboard/BookingCard.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Booking } from '@/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { CancelBookingDialog } from './CancelBookingDialog';
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  Eye,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { api, endpoints } from '@/lib/api';
import { toast } from 'sonner';

interface BookingCardProps {
  booking: Booking;
  onCancelled?: () => void;
}

export function BookingCard({ booking, onCancelled }: BookingCardProps) {
  const { getToken } = useAuth();
  const museum = typeof booking.museum === 'object' ? booking.museum : null;
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [downloadingTicket, setDownloadingTicket] = useState(false);

  const handleDownloadTicket = async () => {
    setDownloadingTicket(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in to download ticket');
        return;
      }

      // Create download URL with auth token
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const downloadUrl = `${baseUrl}${endpoints.bookings.download(booking._id)}`;

      // Fetch PDF with auth
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download ticket');
      }

      // Get PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${booking.bookingReference}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Ticket downloaded successfully!');
    } catch (error: any) {
      console.error('Error downloading ticket:', error);
      toast.error(error.message || 'Failed to download ticket');
    } finally {
      setDownloadingTicket(false);
    }
  };

  const handleCancelSuccess = () => {
    setShowCancelDialog(false);
    if (onCancelled) {
      onCancelled();
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">
                {museum?.title || 'Museum'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {museum?.location}
                  {/* {museum?.city}, {museum?.country} */}
                </span>
              </div>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(booking.visitDate, 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold">{formatCurrency(booking.totalAmount)}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Ref: {booking.bookingReference}
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/50 p-4 flex flex-col sm:flex-row flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild className="w-full sm:flex-1 min-w-[140px]">
            <Link href={`/bookings/${booking._id}/confirmation`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          
          {booking.status === 'confirmed' && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:flex-1 min-w-[140px]"
                onClick={handleDownloadTicket}
                disabled={downloadingTicket}
              >
                <Download className="h-4 w-4 mr-2" />
                {downloadingTicket ? 'Loading...' : 'Download Ticket'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full sm:flex-1 min-w-[140px]"
                onClick={() => setShowCancelDialog(true)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      {/* Cancel Dialog */}
      <CancelBookingDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        booking={booking}
        onSuccess={handleCancelSuccess}
      />
    </>
  );
}