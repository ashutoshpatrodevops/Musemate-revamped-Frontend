// components/dashboard/MyReviewCard.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Review } from '@/types';
import { formatDate } from '@/lib/utils';
import { EditReviewDialog } from './EditReviewDialog';
import { DeleteReviewDialog } from './DeleteReviewDialog';
import {
  Star,
  Edit,
  Trash2,
  CheckCircle2,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface MyReviewCardProps {
  review: Review;
  onDeleted: (reviewId: string) => void;
  onUpdated: () => void;
}

export function MyReviewCard({ review, onDeleted, onUpdated }: MyReviewCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const museum = typeof review.museum === 'object' ? review.museum : null;

  return (
    <>
      <Card>
        <CardContent className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href={`/museums/${museum?._id}`}
                  className="font-semibold text-lg hover:underline"
                >
                  {museum?.title || 'Museum'}
                </Link>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Posted on {formatDate(review.createdAt, 'MMM dd, yyyy')}
                {review.visitDate && (
                  <> • Visited on {formatDate(review.visitDate, 'MMM dd, yyyy')}</>
                )}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            {review.isVerifiedVisit && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified Visit
              </Badge>
            )}
            {review.response && (
              <Badge variant="outline" className="gap-1">
                <MessageSquare className="h-3 w-3" />
                Museum Responded
              </Badge>
            )}
          </div>

          {/* Title */}
          {review.title && (
            <h4 className="font-semibold mb-2">{review.title}</h4>
          )}

          {/* Comment */}
          <p className="text-sm leading-relaxed mb-4">{review.comment}</p>

          {/* Pros & Cons */}
          {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {review.pros && review.pros.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-green-600 mb-2">👍 Pros</p>
                  <ul className="text-sm space-y-1">
                    {review.pros.map((pro, index) => (
                      <li key={index} className="text-muted-foreground">
                        • {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {review.cons && review.cons.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-600 mb-2">👎 Cons</p>
                  <ul className="text-sm space-y-1">
                    {review.cons.map((con, index) => (
                      <li key={index} className="text-muted-foreground">
                        • {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Museum Response */}
          {review.response && (
            <div className="p-4 bg-muted rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Museum Response</Badge>
                <p className="text-xs text-muted-foreground">
                  {formatDate(review.response.respondedAt, 'MMM dd, yyyy')}
                </p>
              </div>
              <p className="text-sm">{review.response.comment}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4 border-t sm:flex-row sm:items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
            <div className="flex-1" />
            <p className="text-xs text-muted-foreground">
              {review.helpfulCount || 0} people found this helpful
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditReviewDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        review={review}
        onSuccess={() => {
          setShowEditDialog(false);
          onUpdated();
        }}
      />

      {/* Delete Dialog */}
      <DeleteReviewDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        reviewId={review._id}
        onSuccess={() => {
          setShowDeleteDialog(false);
          onDeleted(review._id);
        }}
      />
    </>
  );
}