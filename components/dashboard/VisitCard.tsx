// components/dashboard/VisitCard.tsx

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Booking } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  QrCode,
} from 'lucide-react';
import Link from 'next/link';

interface VisitCardProps {
  booking: Booking;
  type: 'upcoming' | 'completed';
}

export function VisitCard({ booking, type }: VisitCardProps) {
  const museum = typeof booking.museum === 'object' ? booking.museum : null;
  const isUpcoming = type === 'upcoming';

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">
              {museum?.title || 'Museum'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{museum?.city}, {museum?.country}</span>
            </div>
          </div>
          <Badge variant={isUpcoming ? 'default' : 'secondary'}>
            {isUpcoming ? 'Upcoming' : 'Completed'}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(booking.visitDate, 'EEEE, MMMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
            </span>
          </div>
        </div>

        {isUpcoming ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="sm" asChild className="w-full sm:flex-1">
              <Link href={`/bookings/${booking._id}/confirmation`}>
                <QrCode className="h-4 w-4 mr-2" />
                Show Ticket
              </Link>
            </Button>
            <Button size="sm" className="w-full sm:flex-1" asChild>
              <Link href={`/museums/${museum?._id}`}>
                View Museum
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="sm" className="w-full sm:flex-1">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Write Review
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:flex-1" asChild>
              <Link href={`/bookings/${booking._id}/confirmation`}>
                View Details
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}