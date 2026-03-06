import PlatformStats from '@/components/admin/PlatFormStats';
import RevenueChart from '@/components/admin/RevenueChart';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of platform activity, growth, and revenue.
        </p>
      </div>

      <PlatformStats />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Use the left menu to manage museums, users, bookings, and reviews.
          </p>
        </div>
      </div>
    </div>
  );
}
