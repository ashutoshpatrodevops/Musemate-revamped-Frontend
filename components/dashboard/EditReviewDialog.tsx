// components/dashboard/EditReviewDialog.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { api, endpoints } from '@/lib/api';
import { Review } from '@/types';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface EditReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review;
  onSuccess: () => void;
}

export function EditReviewDialog({
  open,
  onOpenChange,
  review,
  onSuccess,
}: EditReviewDialogProps) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    title: review.title || '',
    comment: review.comment,
    pros: review.pros?.join('\n') || '',
    cons: review.cons?.join('\n') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!formData.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in');
        return;
      }

      const updateData = {
        rating,
        title: formData.title,
        comment: formData.comment,
        pros: formData.pros ? formData.pros.split('\n').filter((p) => p.trim()) : [],
        cons: formData.cons ? formData.cons.split('\n').filter((c) => c.trim()) : [],
      };

      const response = await api.put(
        endpoints.reviews.update(review._id),
        updateData,
        token
      );

      if (response.success) {
        toast.success('Review updated successfully!');
        onSuccess();
      } else {
        toast.error(response.error || 'Failed to update review');
      }
    } catch (error: any) {
      console.error('Error updating review:', error);
      toast.error(error.message || 'Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title</Label>
            <Input
              id="title"
              placeholder="Summarize your experience..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              placeholder="Tell us about your experience..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={6}
              required
            />
          </div>

          {/* Pros */}
          <div className="space-y-2">
            <Label htmlFor="pros">Pros (one per line)</Label>
            <Textarea
              id="pros"
              placeholder="What did you like?"
              value={formData.pros}
              onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
              rows={3}
            />
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <Label htmlFor="cons">Cons (one per line)</Label>
            <Textarea
              id="cons"
              placeholder="What could be improved?"
              value={formData.cons}
              onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}