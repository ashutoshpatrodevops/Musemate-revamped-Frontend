// components/dashboard/DashboardHeader.tsx

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
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Mobile Menu + Title */}
        <div className="flex items-center gap-3">
          <DashboardMobileSidebar />
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground hidden md:block">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-9 w-9',
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}