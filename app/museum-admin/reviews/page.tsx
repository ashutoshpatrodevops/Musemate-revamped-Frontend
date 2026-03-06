'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { museumAdminApi } from '@/lib/museum-admin';
import { Museum, Review } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Label } from 'recharts';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Star, MessageSquare, Filter, AlertCircle, Send, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ReviewsPage() {
  const { getToken } = useAuth();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [museumFilter, setMuseumFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  
  // Response dialog
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [museumFilter, ratingFilter, allReviews]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Load museums
      const museumsRes = await museumAdminApi.getMyMuseums(token);
      if (!museumsRes.success || !museumsRes.data) {
        setError('Failed to load museums');
        return;
      }

      const museumsData = museumsRes.data.data || [];
      setMuseums(museumsData);

      // Load reviews for all museums
      const reviewsPromises = museumsData.map((museum) =>
        museumAdminApi.getMuseumReviews(museum._id, token)
      );

      const reviewsResults = await Promise.all(reviewsPromises);

      // Combine all reviews
      const allReviewsData = reviewsResults.flatMap((result) =>
        result.success && result.data ? result.data : []
      );

      setAllReviews(allReviewsData);
      setFilteredReviews(allReviewsData);
    } catch (err: any) {
      console.error('Error loading reviews:', err);
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = [...allReviews];

    // Filter by museum
    if (museumFilter !== 'all') {
      filtered = filtered.filter(
        (review) =>
          (typeof review.museum === 'object'
            ? review.museum._id
            : review.museum) === museumFilter
      );
    }

    // Filter by rating
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(ratingFilter)
      );
    }

    setFilteredReviews(filtered);
  };

  const handleRespondToReview = async () => {
    if (!selectedReview || !responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }

    try {
      setResponding(true);

      const token = await getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await museumAdminApi.respondToReview(
        selectedReview._id,
        responseText,
        token
      );

      if (response.success) {
        toast.success('Response posted successfully');
        setSelectedReview(null);
        setResponseText('');
        loadData(); // Reload reviews
      } else {
        toast.error(response.message || 'Failed to post response');
      }
    } catch (err: any) {
      console.error('Error responding to review:', err);
      toast.error(err.message || 'Failed to post response');
    } finally {
      setResponding(false);
    }
  };

  const getMuseumName = (museum: any) => {
    return typeof museum === 'object' ? museum.title : 'Unknown Museum';
  };

  const getAuthorName = (author: any) => {
    return typeof author === 'object' ? author.username : 'Anonymous';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Calculate stats
  const stats = {
    total: allReviews.length,
    averageRating: allReviews.length > 0
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : '0.0',
    responded: allReviews.filter((r) => r.response).length,
    verified: allReviews.filter((r) => r.isVerifiedVisit).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Manage reviews across all your museums
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground mt-1">out of 5.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responded</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responded}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.responded / stats.total) * 100) : 0}% response rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Visits</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={museumFilter} onValueChange={setMuseumFilter}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Filter by museum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Museums</SelectItem>
                {museums.map((museum) => (
                  <SelectItem key={museum._id} value={museum._id}>
                    {museum.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No reviews found
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {getAuthorName(review.author).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{getAuthorName(review.author)}</h4>
                          {review.isVerifiedVisit && (
                            <Badge variant="outline" className="text-xs bg-green-50">
                              Verified Visit
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getMuseumName(review.museum)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  {/* Review Title & Content */}
                  {review.title && (
                    <h3 className="font-semibold text-lg">{review.title}</h3>
                  )}
                  <p className="text-sm">{review.comment}</p>

                  {/* Pros & Cons */}
                  {(review.pros && review.pros.length > 0 || review.cons && review.cons.length > 0) && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {review.pros && review.pros.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-green-600 mb-2">Pros:</h5>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {review.pros.map((pro, i) => (
                              <li key={i}>{pro}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {review.cons && review.cons.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-red-600 mb-2">Cons:</h5>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {review.cons.map((con, i) => (
                              <li key={i}>{con}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Helpful Count */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {review.helpfulCount} found this helpful
                    </span>
                  </div>

                  {/* Admin Response */}
                  {review.response ? (
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge>Museum Response</Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(review.response.respondedAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm">{review.response.comment}</p>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReview(review)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Respond
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Response Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>
              Write a professional response to this review
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              {/* Review Preview */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {getAuthorName(selectedReview.author)}
                  </span>
                  {renderStars(selectedReview.rating)}
                </div>
                <p className="text-sm">{selectedReview.comment}</p>
              </div>

              {/* Response Input */}
              <div className="space-y-2">
                <Label>Your Response</Label>
                <Textarea
                  placeholder="Thank you for your feedback..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={5}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedReview(null);
                setResponseText('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRespondToReview} disabled={responding}>
              {responding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}