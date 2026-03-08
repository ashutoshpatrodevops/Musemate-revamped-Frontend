'use client';

import { motion } from 'framer-motion';
import { IndianRupee, Calendar, Users, Building2, TrendingUp } from 'lucide-react';

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
      description: 'Total earnings',
      icon: IndianRupee,
      glow: 'bg-emerald-500',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toLocaleString(),
      description: 'All time bookings',
      icon: Calendar,
      glow: 'bg-blue-500',
    },
    {
      title: 'Total Visitors',
      value: stats.totalVisitors.toLocaleString(),
      description: 'Unique visitors',
      icon: Users,
      glow: 'bg-violet-500',
    },
    {
      title: 'Active Museums',
      value: stats.activeMuseums.toString(),
      description: 'Currently active',
      icon: Building2,
      glow: 'bg-amber-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="relative group rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm p-5 overflow-hidden hover:border-border/70 hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Glow blob */}
            <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity ${card.glow}`} />

            {/* Top row */}
            <div className="flex items-start justify-between mb-4 relative">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.glow} bg-opacity-10 border border-white/5`}>
                <Icon className="w-4 h-4 text-foreground/70" />
              </div>
              <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/25" />
            </div>

            {/* Value */}
            <p className="text-2xl font-bold tracking-tight relative">{card.value}</p>

            {/* Label */}
            <p className="text-xs text-muted-foreground mt-0.5 font-medium relative">{card.title}</p>
            <p className="text-[10px] text-muted-foreground/50 mt-0.5 relative">{card.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}