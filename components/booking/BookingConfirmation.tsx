// components/booking/BookingConfirmation.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Booking } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CheckCircle2,
  Download,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { api, endpoints } from '@/lib/api';
import { useState } from 'react';
import { toast } from 'sonner';

interface BookingConfirmationProps {
  booking: Booking;
  qrCodeData?: string; // ⭐ Add this
}

export function BookingConfirmation({ booking, qrCodeData }: BookingConfirmationProps) {
  const { getToken } = useAuth();
  const museum = typeof booking.museum === 'object' ? booking.museum : null;
  const [downloadingTicket, setDownloadingTicket] = useState(false);
   if (!booking || !booking.contactInfo) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Loading booking details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  const handleDownloadTicket = async () => {
    setDownloadingTicket(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in to download ticket');
        return;
      }

      // Fetch PDF with auth
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const downloadUrl = `${baseUrl}${endpoints.bookings.download(booking._id)}`;

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

  const handleEmailTicket = async () => {
    toast.info('Ticket has been sent to your email!');
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                Booking Confirmed!
              </h2>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Your museum tickets have been booked successfully. A confirmation email has
                been sent to {booking.contactInfo.email}
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Ticket className="h-4 w-4" />
                <span className="font-mono font-semibold">
                  Booking Reference: {booking.bookingReference}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* QR Code Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Your Ticket QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-6">
                {qrCodeData || booking.qrCode ? (
                  <div className="relative w-64 h-64 border-4 border-primary rounded-lg p-4 bg-white flex items-center justify-center">
                    {/* ⭐ Use regular img tag for base64 data URLs */}
                    <img
                      src={qrCodeData || booking.qrCode}
                      alt="Booking QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 border-4 border-dashed border-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">QR Code will appear here</p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-4 text-center max-w-md">
                  Show this QR code at the museum entrance for check-in
                </p>
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleDownloadTicket} disabled={downloadingTicket}>
                    <Download className="h-4 w-4 mr-2" />
                    {downloadingTicket ? 'Downloading...' : 'Download Ticket'}
                  </Button>
                  <Button variant="outline" onClick={handleEmailTicket}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email Ticket
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visit Details */}
          <Card>
            <CardHeader>
              <CardTitle>Visit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {museum && (
                <div>
                  <h3 className="font-semibold text-lg mb-1">{museum.title}</h3>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {museum.city}, {museum.state}, {museum.country}
                    </span>
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Visit Date</p>
                    <p className="font-semibold">
                      {format(new Date(booking.visitDate), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time Slot</p>
                    <p className="font-semibold">
                      {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Visitors</p>
                    <p className="font-semibold">{booking.totalVisitors}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Status</p>
                    <Badge variant="default" className="mt-1">
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visitors List */}
          <Card>
            <CardHeader>
              <CardTitle>Visitor Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {booking.visitors.map((visitor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{visitor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Age: {visitor.age} • {visitor.ticketType.charAt(0).toUpperCase() + visitor.ticketType.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{booking.contactInfo?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{booking.contactInfo?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{booking.contactInfo?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{booking.contactInfo?.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment Summary */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ticket Breakdown */}
              <div className="space-y-2">
                {booking.ticketBreakdown.map((ticket, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">
                      {ticket.type} x {ticket.quantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(ticket.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Audio Guide */}
              {booking.hasAudioGuide && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Audio Guide x {booking.audioGuideQuantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(
                        (typeof booking.museum === 'object' && booking.museum.audioGuidePrice
                          ? booking.museum.audioGuidePrice
                          : 0) * booking.audioGuideQuantity
                      )}
                    </span>
                  </div>
                  <Separator />
                </>
              )}

              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(booking.subtotal)}</span>
              </div>

              {/* Tax */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (18% GST)</span>
                <span>{formatCurrency(booking.tax)}</span>
              </div>

              {/* Platform Fee */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (2%)</span>
                <span>{formatCurrency(booking.platformFee)}</span>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between font-bold text-lg">
                <span>Total Paid</span>
                <span className="text-primary">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>

              {/* Payment Details */}
              <div className="pt-4 space-y-2 text-xs text-muted-foreground">
                <p>Payment ID: {booking.payment.razorpayPaymentId}</p>
                <p>
                  Paid on:{' '}
                  {booking.payment.paidAt
                    ? format(new Date(booking.payment.paidAt), 'MMM dd, yyyy hh:mm a')
                    : 'N/A'}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {booking.payment.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-900">
            <CardHeader>
              <CardTitle className="text-sm text-yellow-900 dark:text-yellow-100">
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
              <p>• Please arrive 15 minutes before your scheduled time</p>
              <p>• Carry a valid ID proof for verification</p>
              <p>• QR code must be presented at the entrance</p>
              <p>• Tickets are non-transferable</p>
              {booking.hasAudioGuide && (
                <p>• Collect your audio guide at the reception</p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/dashboard/bookings">
                View All Bookings
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/museums">Browse More Museums</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}