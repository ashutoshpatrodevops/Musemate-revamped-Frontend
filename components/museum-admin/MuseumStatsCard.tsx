'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Calendar, Users, Building2, Star } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalRevenue: number;
    totalBookings: number;
    totalVisitors: number;
    activeMuseums: number;
    averageRating?: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      description: 'Total earnings',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toLocaleString(),
      icon: Calendar,
      description: 'All time bookings',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Visitors',
      value: stats.totalVisitors.toLocaleString(),
      icon: Users,
      description: 'Unique visitors',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Active Museums',
      value: stats.activeMuseums.toString(),
      icon: Building2,
      description: 'Currently active',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}