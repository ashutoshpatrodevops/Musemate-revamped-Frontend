// components/museum-admin/MuseumAdminCard.tsx

'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Museum } from '@/types/index';
import { formatCurrency } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

import {
  MapPin,
  Star,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog } from '@radix-ui/react-dialog';

interface MuseumAdminCardProps {
  museum: Museum;
  onDelete: (museumId: string) => void;
}

export function MuseumAdminCard({ museum, onDelete }: MuseumAdminCardProps) {
  const lowestPrice = museum.ticketTypes.length > 0
    ? Math.min(...museum.ticketTypes.map(t => t.price))
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 w-full">
        {museum.images && museum.images.length > 0 ? (
          <Image
            src={museum.images[0].url}
            alt={museum.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {/* Status Badge */}
        <Badge className={`absolute top-2 right-2 ${getStatusColor(museum.status)}`}>
          {museum.status}
        </Badge>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{museum.title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{museum.city}, {museum.country}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{museum.averageRating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">{museum.totalBookings || 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">Bookings</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">{museum.viewCount || 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>
        </div>

        {/* Price */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">Starting from</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(lowestPrice)}</p>
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="bg-muted/50 p-3 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/museums/${museum._id}`} target="_blank">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/museum-admin/museums/${museum._id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
       <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive" size="sm">
      <Trash2 className="h-4 w-4" />
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Museum</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to delete <b>{museum.title}</b>?  
        This action cannot be undone and all related bookings and data will be lost.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        className="bg-destructive hover:bg-destructive/90"
        onClick={() => onDelete(museum._id)}
      >
        Yes, Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
      </CardFooter>
    </Card>
  );
}