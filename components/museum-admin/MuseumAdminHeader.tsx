'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { MuseumAdminMobileSidebar } from './MuseumAdminMobileSidebar';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface MuseumAdminHeaderProps {
  title: string;
  description?: string;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getEmoji() {
  const h = new Date().getHours();
  if (h < 12) return '☀️';
  if (h < 17) return '🌤️';
  return '🌙';
}

export function MuseumAdminHeader({ title, description }: MuseumAdminHeaderProps) {
  const { user } = useUser();
  const firstName = user?.firstName || 'there';

  return (
    <header className="sticky top-3 z-50 w-full px-3 md:px-6 pointer-events-none">
      <div
        className="mx-auto flex h-14 max-w-7xl items-center justify-between pointer-events-auto
                   rounded-2xl border border-white/10 px-5
                   bg-background/60 backdrop-blur-xl
                   shadow-[0_4px_24px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.07)]
                   transition-all duration-300"
      >
        {/* top shimmer */}
        <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/25 to-transparent pointer-events-none" />

        {/* ── Left: mobile menu + title ── */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="md:hidden">
            <MuseumAdminMobileSidebar />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold tracking-tight truncate md:text-base">
              {title}
            </h1>
            {description && (
              <p className="hidden text-[10px] uppercase tracking-widest text-muted-foreground md:block truncate">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* ── Center: greeting capsule ── */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full
                     border border-white/10 bg-white/5 backdrop-blur-md
                     shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]
                     select-none"
        >
          <span className="text-sm leading-none">{getEmoji()}</span>
          <span className="text-sm text-foreground/70">
            {getGreeting()},{' '}
            <span className="font-semibold text-foreground">{firstName}</span>
          </span>
        </motion.div>

        {/* ── Right: bell + avatar ── */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full hover:bg-white/8"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute right-2 top-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          </Button>

          <div className="w-px h-5 bg-border/40 mx-0.5" />

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8 transition-all hover:ring-2 hover:ring-primary/40',
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}