// app/museums/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, endpoints } from '@/lib/api';
import { Museum } from '@/types';
import { MuseumGallery } from '@/components/museum/MuseumGallery';
import { MuseumInfo } from '@/components/museum/MuseumInfo';
import { TicketPricing } from '@/components/museum/TicketPricing';
import { OperatingHours } from '@/components/museum/OperatingHours';
import { ReviewSection } from '@/components/museum/ReviewSection';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Heart } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

// Dynamically import MuseumMap to avoid SSR issues with Leaflet
const MuseumMap = dynamic(
  () => import('@/components/museum/MuseumMap').then(mod => ({ default: mod.MuseumMap })),
  { 
    ssr: false, 
    loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> 
  }
);

export default function MuseumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();
  const [museum, setMuseum] = useState<Museum | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savingWatchlist, setSavingWatchlist] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchMuseum();
      if (isSignedIn) {
        checkWatchlistStatus();
      }
    }
  }, [params.id, isSignedIn]);

  const fetchMuseum = async () => {
    setLoading(true);
    try {
      const response = await api.get<Museum>(endpoints.museums.detail(params.id as string));

      if (response.success && response.data) {
        setMuseum(response.data);
      } else {
        router.push('/museums');
      }
    } catch (error) {
      console.error('Error fetching museum:', error);
      router.push('/museums');
    } finally {
      setLoading(false);
    }
  };

  // Check if museum is in user's watchlist
  const checkWatchlistStatus = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await api.get<Museum[]>(endpoints.users.watchlist, token);
      if (!response.success || !response.data) {
        return;
      }

      const isInWatchlist = response.data.some((item) => item._id === params.id);
      setIsSaved(isInWatchlist);
    } catch (error) {
      console.error('Error checking watchlist:', error);
    }
  };

  // Toggle watchlist
  const handleToggleWatchlist = async () => {
    if (!isSignedIn) {
      toast.error('Please sign in to save museums');
      router.push('/sign-in');
      return;
    }

    setSavingWatchlist(true);

    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in');
        return;
      }

      if (isSaved) {
        const response = await api.delete(
          endpoints.users.removeFromWatchlist(params.id as string),
          token
        );
        if (!response.success) {
          toast.error(response.error || 'Failed to remove from watchlist');
          return;
        }
        setIsSaved(false);
        toast.success('Removed from watchlist');
      } else {
        const response = await api.post(
          endpoints.users.addToWatchlist(params.id as string),
          {},
          token
        );
        if (!response.success) {
          toast.error(response.error || 'Failed to add to watchlist');
          return;
        }
        setIsSaved(true);
        toast.success('Added to watchlist');
      }
    } catch (error: any) {
      console.error('Error toggling watchlist:', error);
      toast.error(error.message || 'Failed to update watchlist');
    } finally {
      setSavingWatchlist(false);
    }
  };

  const handleBookNow = () => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    router.push(`/museums/${params.id}/book`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!museum) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 mt-10">
      {/* Header with Back Button and Watchlist */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/museums')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Museums
        </Button>
        {/* Watchlist Button (only show when signed in) */}
        {isSignedIn && (
          <Button
            variant={isSaved ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleWatchlist}
            disabled={savingWatchlist}
            className="gap-2"
          >
            <Heart
              className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`}
            />
            {savingWatchlist
              ? 'Saving...'
              : isSaved
              ? 'Saved'
              : 'Save to Watchlist'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <MuseumGallery images={museum.images} title={museum.title} />

          {/* Museum Info */}
          <MuseumInfo museum={museum} />

          {/* Reviews */}
          <ReviewSection
            museumId={museum._id}
            averageRating={museum.averageRating}
            totalReviews={museum.totalReviews}
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Sticky Booking Card */}
          <div className="sticky top-20 space-y-6">
            {/* Ticket Pricing */}
            <TicketPricing ticketTypes={museum.ticketTypes} />

            {/* Book Now Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleBookNow}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book Now
            </Button>

            {/* Operating Hours */}
            <OperatingHours hours={museum.operatingHours} />

            {/* Location & Map */}
            <div className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
              <h3 className="text-lg font-bold">Location</h3>
              <MuseumMap 
                coordinates={museum.geometry.coordinates} 
                title={museum.title} 
              />
              <p className="text-sm text-muted-foreground">{museum.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}