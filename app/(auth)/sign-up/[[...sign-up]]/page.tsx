// app/(auth)/sign-up/[[...sign-up]]/page.tsx
'use client';

import { SignUp } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">
            Join MuseMate and start exploring amazing museums
          </p>
        </div>
        
        <SignUp 
          appearance={clerkAppearance}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/auth-redirect"
        />
      </div>
    </div>
  );
}