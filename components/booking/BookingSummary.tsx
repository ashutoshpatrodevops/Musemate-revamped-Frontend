// components/booking/BookingSummary.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Visitor, TicketTypeInfo } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar, Clock, Users, Ticket } from 'lucide-react';

interface BookingSummaryProps {
  museumTitle: string;
  selectedDate: Date | undefined;
  selectedTimeSlot: { startTime: string; endTime: string } | null;
  visitors: Visitor[];
  ticketTypes: TicketTypeInfo[];
  hasAudioGuide: boolean;
  audioGuideQuantity: number;
  audioGuidePrice?: number;
}

export function BookingSummary({
  museumTitle,
  selectedDate,
  selectedTimeSlot,
  visitors,
  ticketTypes,
  hasAudioGuide,
  audioGuideQuantity,
  audioGuidePrice,
}: BookingSummaryProps) {
  // Calculate ticket breakdown
  const ticketBreakdown = visitors.reduce((acc, visitor) => {
    const existing = acc.find((item) => item.type === visitor.ticketType);
    if (existing) {
      existing.quantity += 1;
    } else {
      const ticketType = ticketTypes.find((t) => t.type === visitor.ticketType);
      if (ticketType) {
        acc.push({
          type: visitor.ticketType,
          quantity: 1,
          pricePerTicket: ticketType.price,
          subtotal: ticketType.price,
        });
      }
    }
    return acc;
  }, [] as Array<{ type: string; quantity: number; pricePerTicket: number; subtotal: number }>);

  // Update subtotals
  ticketBreakdown.forEach((item) => {
    item.subtotal = item.quantity * item.pricePerTicket;
  });

  // Calculate totals
  const subtotal = ticketBreakdown.reduce((sum, item) => sum + item.subtotal, 0);
  const audioGuideTotal = hasAudioGuide && audioGuidePrice ? audioGuidePrice * audioGuideQuantity : 0;
  const tax = (subtotal + audioGuideTotal) * 0.18; // 18% GST
  const platformFee = (subtotal + audioGuideTotal) * 0.02; // 2% platform fee
  const total = subtotal + audioGuideTotal + tax + platformFee;

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Museum Name */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-2">{museumTitle}</h3>
        </div>

        <Separator />

        {/* Date & Time */}
        {selectedDate && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(selectedDate, 'MMMM dd, yyyy')}</span>
            </div>
            {selectedTimeSlot && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                </span>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Visitors */}
        {visitors.length > 0 && (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" />
                <span>{visitors.length} Visitor{visitors.length > 1 ? 's' : ''}</span>
              </div>
              {ticketBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {item.type} x {item.quantity}
                  </span>
                  <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <Separator />
          </>
        )}

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {hasAudioGuide && audioGuidePrice && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Audio Guide x {audioGuideQuantity}
              </span>
              <span>{formatCurrency(audioGuideTotal)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (18% GST)</span>
            <span>{formatCurrency(tax)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee (2%)</span>
            <span>{formatCurrency(platformFee)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}