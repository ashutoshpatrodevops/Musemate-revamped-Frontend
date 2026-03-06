import RevenueChart from '@/components/admin/RevenueChart';
import PlatformStats from '@/components/admin/PlatFormStats';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Revenue trends and top-level platform metrics.
        </p>
      </div>

      <PlatformStats />

      <RevenueChart />
    </div>
  );
}
