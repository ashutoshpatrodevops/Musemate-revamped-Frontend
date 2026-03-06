import { ReviewsModerationTable } from '@/components/admin/ReviewsModerationTable';

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Moderate reviews and keep content aligned with platform guidelines.
        </p>
      </div>

      <ReviewsModerationTable />
    </div>
  );
}
