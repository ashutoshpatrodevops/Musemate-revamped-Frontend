// app/layout.tsx

'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { clerkAppearance, clerkLocalization } from '@/lib/clerk';
// import { Montserrat } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={clerkAppearance} localization={clerkLocalization}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutContent>{children}</LayoutContent>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ⭐ Hide Navbar & Footer on these routes
  const hideLayout =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/museum-admin') ||
    pathname.startsWith('/chat') ||
    pathname.includes('/confirmation')||
    pathname.includes('/admin')

  // If should hide layout, return just children
  if (hideLayout) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Otherwise, show full layout with Navbar & Footer
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-10">{children}</main>
      <Footer />
    </div>
  );
}