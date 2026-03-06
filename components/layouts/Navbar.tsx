'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lobster_Two } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from './ThemeToggle';
import { APP_NAME } from '@/lib/constants';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils'; // Standard shadcn utility

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/museums', label: 'Museums' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/chat', label: 'Assistant' },
];

const lobsterTwo = Lobster_Two({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;
  const dashboardHref = role === 'admin' || role === 'super_admin'
    ? '/admin/dashboard'
    : '/dashboard/bookings';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0  z-50 flex justify-center p-2 transition-all duration-300 pointer-events-none">
      <header
  className={cn(
    "flex items-center justify-between transition-all duration-500 ease-in-out pointer-events-auto",
    // ADD THIS:
    "pl-12 pr-6", // Increases left padding, keeping right padding standard
    
    // Initial State
    "w-full h-16 bg-transparent border-transparent",
    
    // Scrolled State
    scrolled && [
      "w-full max-w-4xl h-14 rounded-full border border-white/20 shadow-lg",
      "bg-background/70 backdrop-blur-md dark:bg-black/40",
      "mt-2",
      "pl-10 pr-4" // Slightly adjust padding for the smaller capsule
    ]
  )}
>
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-1 shrink-0">
          <Image
            src="/finallogo.png"
            alt={`${APP_NAME} logo`}
            width={50}
            height={50}
            className="h-12 w-12 object-contain"
            priority
          />
          <span className={`${lobsterTwo.className} text-2xl leading-none tracking-tight`}>
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop Navigation */}
        {/* Desktop Navigation */}
<nav className="hidden md:flex items-center ml-auto mr-4"> {/* Added ml-auto and a small mr-4 */}
  {navLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-full transition-all hover:bg-accent",
        pathname === link.href ? "text-primary" : "text-muted-foreground"
      )}
    >
      {link.label}
    </Link>
  ))}
</nav>
        {/* Right Side - Auth & Actions */}
        <div className="flex items-center space-x-2">
          
          <ThemeToggle />

          <SignedIn>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild className="hidden md:flex rounded-full">
                <Link href={dashboardHref}>My Dashboard</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="rounded-full">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>

          <MobileNav />
        </div>
      </header>
    </div>
  );
}