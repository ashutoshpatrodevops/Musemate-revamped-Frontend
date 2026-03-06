'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Compass, Home, Search } from 'lucide-react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  // This ensures the component only renders animations on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a simple version or null during server-side pre-rendering
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon - Now safe because of the 'mounted' check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-8xl font-black tracking-tighter text-primary/20 mb-2">404</h1>
          <h2 className="text-4xl font-bold tracking-tight mb-4">You&apos;ve wandered off the map</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
            It looks like this wing of the museum is still under construction. Let&apos;s get you back to the main gallery.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="rounded-full px-8 gap-2 w-full sm:w-auto" asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 gap-2 w-full sm:w-auto backdrop-blur-sm" asChild>
            <Link href="/museums">
              <Search className="w-4 h-4" />
              Find a Museum
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}