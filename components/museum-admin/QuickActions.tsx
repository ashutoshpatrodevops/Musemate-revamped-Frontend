'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, QrCode, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface QuickActionsProps {
  museumCount: number;
}

export function QuickActions({ museumCount }: QuickActionsProps) {
  const actions = [
    {
      title: 'Create Museum',
      description: 'Add a new museum',
      href: '/museum-admin/museums/create',
      icon: PlusCircle,
      variant: 'default' as const,
    },
    {
      title: 'View Bookings',
      description: 'Manage bookings',
      href: '/museum-admin/bookings',
      icon: Calendar,
      variant: 'outline' as const,
    },
    {
      title: 'Check-in',
      description: 'Scan QR codes',
      href: '/museum-admin/check-in',
      icon: QrCode,
      variant: 'outline' as const,
    },
    {
      title: 'Analytics',
      description: 'View insights',
      href: '/museum-admin/analytics',
      icon: BarChart3,
      variant: 'outline' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          {museumCount === 0
            ? 'Get started by creating your first museum'
            : `Manage your ${museumCount} museum${museumCount > 1 ? 's' : ''}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <Button
                variant={action.variant}
                className="w-full justify-start gap-3"
                size="lg"
              >
                <Icon className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{action.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </div>
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}