// app/dashboard/reviews/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MyReviewCard } from '@/components/dashboard/MyReviewCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api, endpoints } from '@/lib/api';
import { Review } from '@/types';
import { Star, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function MyReviewsPage() {
  const { getToken } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please sign in to view reviews');
        return;
      }

      // ⭐ Changed endpoint to match yours
      const response = await api.get<Review[]>(
        endpoints.reviews.myReviews,
        token
      );

      if (response.success && response.data) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewDeleted = (reviewId: string) => {
    setReviews(reviews.filter((r) => r._id !== reviewId));
    toast.success('Review deleted successfully');
  };

  const handleReviewUpdated = () => {
    fetchMyReviews(); // Refresh list
  };

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'with-response') return review.response !== undefined;
    if (activeTab === 'without-response') return review.response === undefined;
    return true;
  });

  const stats = {
    total: reviews.length,
    withResponse: reviews.filter((r) => r.response).length,
    withoutResponse: reviews.filter((r) => !r.response).length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
  };

  return (
    <div>
      <DashboardHeader
        title="My Reviews"
        description="Manage your museum reviews"
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Cards */}
        {!loading && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                {stats.averageRating}
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">With Response</p>
              <p className="text-2xl font-bold">{stats.withResponse}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Pending Response</p>
              <p className="text-2xl font-bold">{stats.withoutResponse}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All Reviews ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="with-response">
              With Response ({stats.withResponse})
            </TabsTrigger>
            <TabsTrigger value="without-response">
              Pending ({stats.withoutResponse})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : filteredReviews.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title={
                  activeTab === 'all'
                    ? 'No reviews yet'
                    : activeTab === 'with-response'
                    ? 'No reviews with responses'
                    : 'No reviews without responses'
                }
                description={
                  activeTab === 'all'
                    ? 'Visit museums and share your experience!'
                    : 'Check other tabs for your reviews'
                }
                actionLabel={activeTab === 'all' ? 'Browse Museums' : undefined}
                actionHref={activeTab === 'all' ? '/museums' : undefined}
              />
            ) : (
              <>
                {filteredReviews.map((review) => (
                  <MyReviewCard
                    key={review._id}
                    review={review}
                    onDeleted={handleReviewDeleted}
                    onUpdated={handleReviewUpdated}
                  />
                ))}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}