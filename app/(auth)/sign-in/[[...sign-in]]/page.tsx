// app/(auth)/sign-in/[[...sign-in]]/page.tsx
'use client';

import { SignIn } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk';

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_40%,_#fff_75%)] px-4 py-12">
      <div className="pointer-events-none absolute -left-16 top-20 h-40 w-40 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-16 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="relative w-full max-w-[420px]">
        <SignIn 
          appearance={clerkAppearance}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/auth-redirect"
        />
      </div>
    </main>
  );
}