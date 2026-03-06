// components/museum-admin/RecentBookings.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RecentBookings({ museums }: { museums: any[] }) {
  const bookings = museums.flatMap((m) => m.recentBookings || []).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookings.length === 0 && (
          <p className="text-sm text-muted-foreground">No bookings yet</p>
        )}

        {bookings.map((b: any) => (
          <div key={b._id} className="flex justify-between border-b pb-2">
            <div>
              <p className="font-medium">{b.user?.username}</p>
              <p className="text-sm text-muted-foreground">{b.museum?.title}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{b.totalAmount}</p>
              <p className="text-sm text-muted-foreground">{b.status}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
