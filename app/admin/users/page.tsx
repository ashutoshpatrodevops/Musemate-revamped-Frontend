import { UsersTable } from '@/components/admin/UsersTable';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-2">
          Manage user roles and access across the platform.
        </p>
      </div>

      <UsersTable />
    </div>
  );
}
