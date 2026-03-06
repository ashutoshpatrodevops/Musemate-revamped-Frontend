'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Star } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

type Review = {
  _id: string;
  author?: {
    username?: string;
    email?: string;
  };
  museum?: {
    title?: string;
  };
  rating: number; // 1-5
  comment: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
};

export function ReviewsModerationTable() {
  const { getToken } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await res.json();
      setReviews(payload.data ?? payload);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (id: string, status: 'approved' | 'rejected') => {
    const token = await getToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/admin/${id}/status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    fetchReviews();
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Reviews</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Museum</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>
                    {review.author?.username || review.author?.email || 'User'}
                  </TableCell>
                  <TableCell>{review.museum?.title || 'Museum'}</TableCell>
                  <TableCell className="flex items-center space-x-1">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 text-yellow-500" />
                    ))}
                  </TableCell>
                  <TableCell>{review.comment}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        review.status === 'approved'
                          ? 'success'
                          : review.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {(review.status === 'pending' || review.status === 'flagged') && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReviewStatus(review._id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateReviewStatus(review._id, 'rejected')}
                        >
                          Remove
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
