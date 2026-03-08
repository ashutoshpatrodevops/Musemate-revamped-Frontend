'use client';

import { UserButton } from '@clerk/nextjs';
import { DashboardMobileSidebar } from './DashboardMobileSidebar';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    // Outer wrapper handles the stickiness and centering
    <header className="sticky top-4 z-50 w-full px-4 md:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-white/20 bg-white/10 px-6 py-2 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/20">
        
        {/* Left: Mobile Sidebar + Branding */}
        <div className="flex items-center gap-4">
          <DashboardMobileSidebar />
          <div className="flex flex-col justify-center">
            <h1 className="text-sm font-bold tracking-tight md:text-lg">{title}</h1>
            {description && (
              <p className="hidden text-xs text-muted-foreground md:block">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-9 w-9 rounded-full hover:bg-white/20"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
            </span>
          </Button>

          <div className="flex items-center border-l border-white/20 pl-3">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8 transition-transform hover:scale-105',
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}