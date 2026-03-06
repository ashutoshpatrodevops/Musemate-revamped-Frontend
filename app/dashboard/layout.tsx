// app/dashboard/layout.tsx

import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { API_URL } from '@/lib/constants';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const { sessionClaims, getToken } = await auth();

  if (!user) {
    redirect('/sign-in');
  }

  const role = sessionClaims?.publicMetadata?.role;
  if (role === 'admin' || role === 'super_admin') {
    redirect('/admin/dashboard');
  }

  // Fallback to backend role when Clerk metadata is not set
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
          redirect('/admin/dashboard');
        }
      }
    }
  } catch {
    // Ignore role fallback errors and render user dashboard
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar - Hidden on mobile */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:ml-64">
        {children}
      </div>
    </div>
  );
}