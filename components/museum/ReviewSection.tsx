// components/museum/ReviewSection.tsx

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { ReviewCard } from './ReviewCard';
import { WriteReviewDialog } from './WriteReviewDialog';
import { api, endpoints } from '@/lib/api';
import { Review } from '@/types';
import { Star, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewSectionProps {
  museumId: string;
  averageRating: number;
  totalReviews: number;
}

export function ReviewSection({ museumId, averageRating, totalReviews }: ReviewSectionProps) {
  const { isSignedIn, getToken } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWriteDialog, setShowWriteDialog] = useState(false);
  const [ratingBreakdown, setRatingBreakdown] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, [museumId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get<Review[]>(
        `${endpoints.reviews.museumReviews(museumId)}?limit=10&sortBy=createdAt&sortOrder=desc`
      );

      if (response.success && response.data) {
        setReviews(response.data);
        calculateRatingBreakdown(response.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const calculateRatingBreakdown = (reviewList: Review[]) => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewList.forEach((review) => {
      breakdown[review.rating as keyof typeof breakdown]++;
    });
    setRatingBreakdown(breakdown);
  };

  const handleReviewSubmitted = () => {
    fetchReviews(); // Refresh reviews
    setShowWriteDialog(false);
    toast.success('Review submitted successfully!');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reviews ({totalReviews})</CardTitle>
          {isSignedIn && (
            <Button onClick={() => setShowWriteDialog(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingBreakdown[rating as keyof typeof ratingBreakdown];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Customer Reviews</h3>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <>
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </>
          )}
        </div>
      </CardContent>

      {/* Write Review Dialog */}
      <WriteReviewDialog
        open={showWriteDialog}
        onOpenChange={setShowWriteDialog}
        museumId={museumId}
        onSuccess={handleReviewSubmitted}
      />
    </Card>
  );
}