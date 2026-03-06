'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function AuthRedirectPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }

    const role = user?.publicMetadata?.role as string | undefined;
    if (role === 'admin') {
      router.replace('/admin/dashboard');
      return;
    }

    router.replace('/museums');
  }, [isLoaded, isSignedIn, router, user]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <p className="text-sm text-muted-foreground">Redirecting...</p>
    </main>
  );
}
