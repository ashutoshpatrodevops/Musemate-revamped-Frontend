import { ReactNode } from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { API_URL } from '@/lib/constants';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();
  const { getToken } = await auth();

  if (!user) {
    redirect('/sign-in');
  }

  const role = user.publicMetadata?.role as string | undefined;

  // Allow admins immediately from Clerk metadata.
  if (role === 'admin' || role === 'super_admin') {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-6">
          {children}
        </main>
      </div>
    );
  }

  // Fallback to backend role when Clerk metadata is stale/not present.
  try {
    const token = await getToken();
    if (token) {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        const dbRole = data?.data?.role;
        if (dbRole === 'admin' || dbRole === 'super_admin') {
          return (
            <div className="flex min-h-screen bg-background">
              <AdminSidebar />
              <main className="flex-1 ml-64 p-6">
                {children}
              </main>
            </div>
          );
        }
      }
    }
  } catch {
    // Ignore fallback errors and enforce redirect below.
  }

  redirect('/');
}
