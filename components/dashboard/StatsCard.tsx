// components/dashboard/StatsCard.tsx

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = 'text-primary',
}: StatsCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-2xl bg-primary/10 ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}