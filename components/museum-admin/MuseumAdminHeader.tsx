// components/museum-admin/MuseumAdminHeader.tsx

'use client';

import { UserButton } from '@clerk/nextjs';
import { MuseumAdminMobileSidebar } from './MuseumAdminMobileSidebar';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MuseumAdminHeaderProps {
  title: string;
  description?: string;
}

export function MuseumAdminHeader({ title, description }: MuseumAdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Mobile Menu + Title */}
        <div className="flex items-center gap-4">
          <MuseumAdminMobileSidebar />
          <div>
            <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground hidden md:block">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-4">
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