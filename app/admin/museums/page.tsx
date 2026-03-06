import { MuseumsTable } from '@/components/admin/MuseumsTable';

export default function AdminMuseumsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Museums</h1>
        <p className="text-muted-foreground mt-2">
          Review listings, approve submissions, and manage visibility.
        </p>
      </div>

      <MuseumsTable />
    </div>
  );
}
