// components/dashboard/DeleteReviewDialog.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api, endpoints } from '@/lib/api';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewId: string;
  onSuccess: () => void;
}

export function DeleteReviewDialog({
  open,
  onOpenChange,
  reviewId,
  onSuccess,
}: DeleteReviewDialogProps) {
  const { getToken } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in');
        return;
      }

      const response = await api.delete(endpoints.reviews.delete(reviewId), token);

      if (response.success) {
        toast.success('Review deleted successfully');
        onSuccess();
      } else {
        toast.error(response.error || 'Failed to delete review');
      }
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Review
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this review? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}