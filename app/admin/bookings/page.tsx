import { BookingsAdminTable } from '@/components/admin/BookingsAdminTable';

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground mt-2">
          Monitor all bookings across museums and verify statuses.
        </p>
      </div>

      <BookingsAdminTable />
    </div>
  );
}
