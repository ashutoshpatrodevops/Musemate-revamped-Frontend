// components/dashboard/WatchlistCard.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Museum } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  MapPin,
  Star,
  Heart,
  Calendar,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface WatchlistCardProps {
  museum: Museum;
  onRemove?: (museumId: string) => void;
}

export function WatchlistCard({ museum, onRemove }: WatchlistCardProps) {
  const [removing, setRemoving] = useState(false);

  const lowestPrice = museum.ticketTypes.length > 0
    ? Math.min(...museum.ticketTypes.map(t => t.price))
    : 0;

  const handleRemove = async () => {
    if (onRemove) {
      setRemoving(true);
      await onRemove(museum._id);
      setRemoving(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
          {museum.images && museum.images.length > 0 ? (
            <Image
              src={museum.images[0].url}
              alt={museum.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 192px"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Remove from Watchlist Button */}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={removing}
          >
            {removing ? (
              <Trash2 className="h-4 w-4 animate-pulse" />
            ) : (
              <Heart className="h-4 w-4 fill-current" />
            )}
          </Button>

          {museum.isFeatured && (
            <Badge className="absolute top-2 left-2">Featured</Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4 sm:p-5">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {museum.category}
                  </Badge>
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {museum.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {museum.description}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">
                  {museum.city}, {museum.state}, {museum.country}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{museum.averageRating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({museum.totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-3 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Starting from</p>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(lowestPrice)}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                  <Link href={`/museums/${museum._id}`}>
                    View Details
                  </Link>
                </Button>
                <Button size="sm" asChild className="w-full sm:w-auto">
                  <Link href={`/museums/${museum._id}/book`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}