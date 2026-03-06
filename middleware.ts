// middleware.ts (in root, next to app folder)

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes (accessible without auth)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/museums(.*)',
  '/about',
  '/contact',
  '/faq(.*)',
  '/help(.*)',
  '/safety(.*)',
  '/terms(.*)',
  '/privacy(.*)',
  '/cookies(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  // Protect all other routes
  await auth.protect();
}, {
  // 🔥 ADD THESE LINES
  afterSignInUrl: '/museums',
  afterSignUpUrl: '/museums',
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

// ## **Final File Structure:**
// ```
// frontend/
// ├── app/
// │   └── ...
// ├── lib/
// │   ├── api.ts              ✅
// │   ├── clerk.ts            ✅ (only appearance config)
// │   ├── constants.ts        ✅
// │   └── utils.ts            ✅
// ├── middleware.ts           ✅ (standalone, not importing from lib)
// └── .env.local             ✅