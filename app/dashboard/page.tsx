// app/dashboard/page.tsx

import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { API_URL } from '@/lib/constants';

export default async function DashboardPage() {
  const user = await currentUser();
  const { getToken } = await auth();

  if (!user) {
    redirect('/sign-in');
  }

  const role = user.publicMetadata?.role as string | undefined;
  if (role === 'admin' || role === 'super_admin') {
    redirect('/admin/dashboard');
  }

  // Fallback for stale/missing Clerk metadata.
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
    // Ignore fallback errors and continue to user dashboard.
  }

  redirect('/dashboard/profile');
}