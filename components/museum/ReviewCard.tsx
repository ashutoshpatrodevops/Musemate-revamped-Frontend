// components/museum/ReviewCard.tsx

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Review } from '@/types';
import { formatDate, getInitials } from '@/lib/utils';
import { Star, ThumbsUp,ThumbsDownIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const author = typeof review.author === 'object' ? review.author : null;

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>
                {author ? getInitials(author.username) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{author?.username || 'Anonymous'}</h4>
                {review.isVerifiedVisit && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified Visit
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(review.createdAt, 'MMM dd, yyyy')}
                {review.visitDate && (
                  <> • Visited on {formatDate(review.visitDate, 'MMM dd, yyyy')}</>
                )}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        {review.title && (
          <h5 className="font-semibold mb-2">{review.title}</h5>
        )}

        {/* Comment */}
        <p className="text-sm leading-relaxed mb-4">{review.comment}</p>

        {/* Pros & Cons */}
       {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {review.pros && review.pros.length > 0 && (
              <div>
                <p className="text-sm font-medium text-green-600 mb-2"><ThumbsUp className="h-3 w-3" /> Pros</p>
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
                <p className="text-sm font-medium text-red-600 mb-2"><ThumbsDownIcon className="h-3 w-3" /> Cons</p>
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

        {/* Images */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mb-4">
            {review.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted"
              >
                <img
                  src={image.url}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        

        {/* Museum Response */}
        {review.response && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Museum Response</Badge>
              <p className="text-xs text-muted-foreground">
                {formatDate(review.response.respondedAt, 'MMM dd, yyyy')}
              </p>
            </div>
            <p className="text-sm">{review.response.comment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}