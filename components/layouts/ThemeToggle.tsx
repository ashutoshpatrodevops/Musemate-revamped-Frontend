'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-9 w-14" />; // Placeholder to prevent layout shift

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative h-9 w-16 rounded-full bg-muted/50 p-1 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 border border-white/10"
      aria-label="Toggle theme"
    >
      {/* The Animated Capsule/Knob */}
      <motion.div
        className="flex h-7 w-7 items-center justify-center rounded-full bg-background shadow-sm border border-black/5"
        animate={{
          x: isDark ? 28 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-primary transition-all" />
        ) : (
          <Sun className="h-4 w-4 text-orange-500 transition-all" />
        )}
      </motion.div>

      {/* Decorative Icons in background */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
        <Sun className={`h-3.5 w-3.5 ${isDark ? 'text-muted-foreground/50' : 'opacity-0'}`} />
        <Moon className={`h-3.5 w-3.5 ${!isDark ? 'text-muted-foreground/50' : 'opacity-0'}`} />
      </div>
    </button>
  );
}