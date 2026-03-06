'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Museum } from '@/types/index';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MapPin,
  Star,
  Eye,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  BarChart3,
} from 'lucide-react';
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
import Image from 'next/image';

interface MuseumCardProps {
  museum: Museum;
  onDelete: (museumId: string) => void;
}

export function MuseumCard({ museum, onDelete }: MuseumCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'pending_approval':
        return 'Pending Approval';
      default:
        return status;
    }
  };

  const imageUrl = museum.images?.[0]?.url || '/placeholder-museum.jpg';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-muted">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={museum.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={getStatusColor(museum.status)}>
            {getStatusLabel(museum.status)}
          </Badge>
        </div>

        {/* Featured Badge */}
        {museum.isFeatured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-purple-100 text-purple-800 border-purple-300">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{museum.title}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">
                {museum.city}, {museum.country}
              </span>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/museum-admin/museums/${museum._id}`)}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Stats
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/museum-admin/museums/${museum._id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(event) => {
                      event.preventDefault();
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Museum</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete <b>{museum.title}</b>? This action cannot be undone and all related bookings and data will be lost.
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

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {museum.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-sm">
                {museum.averageRating?.toFixed(1) || '0.0'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground mt-0.5">
              {museum.totalReviews} reviews
            </span>
          </div>

          <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              <span className="font-semibold text-sm">
                {museum.totalBookings || 0}
              </span>
            </div>
            <span className="text-xs text-muted-foreground mt-0.5">
              bookings
            </span>
          </div>

          <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-purple-500" />
              <span className="font-semibold text-sm">
                {museum.viewCount || 0}
              </span>
            </div>
            <span className="text-xs text-muted-foreground mt-0.5">
              views
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/museum-admin/museums/${museum._id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}