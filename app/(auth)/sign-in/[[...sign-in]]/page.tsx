// app/(auth)/sign-in/[[...sign-in]]/page.tsx
'use client';

import Image from 'next/image';
import { SignIn } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk';

export default function SignInPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_0%_0%,hsl(var(--primary)/0.16),transparent_45%),radial-gradient(circle_at_100%_100%,hsl(var(--primary)/0.12),transparent_40%)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="max-w-lg space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/70 px-3 py-1.5 text-xs font-semibold tracking-wide text-foreground/80 backdrop-blur">
              <span className="relative h-5 w-5 overflow-hidden rounded-full bg-primary/10">
                <Image
                  src="/finallogo.png"
                  alt="MuseMate logo"
                  fill
                  sizes="20px"
                  className="object-contain p-[2px]"
                  priority
                />
              </span>
              MuseMate Access
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground">
              Welcome back to your museum command center.
            </h1>
            <p className="text-base text-muted-foreground">
              Sign in to manage bookings, track performance, and continue building memorable visitor experiences.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
              <div className="rounded-xl border border-border/50 bg-background/60 p-3 backdrop-blur">
                <p className="font-semibold text-foreground">Smooth Access</p>
                <p className="text-muted-foreground">Continue where you left off</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-background/60 p-3 backdrop-blur">
                <p className="font-semibold text-foreground">Secure Session</p>
                <p className="text-muted-foreground">Trusted authentication powered by Clerk</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="mx-auto w-full max-w-md rounded-3xl border border-white/20 bg-background/65 p-3 shadow-[0_12px_36px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-4">
            <SignIn
              appearance={{
                ...clerkAppearance,
                elements: {
                  ...clerkAppearance.elements,
                  card: 'rounded-2xl border-0 bg-transparent shadow-none',
                },
              }}
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              forceRedirectUrl="/auth-redirect"
            />
          </div>
        </section>
      </div>
    </main>
  );
}