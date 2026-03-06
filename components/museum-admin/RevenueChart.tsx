// components/museum-admin/RevenueChart.tsx

'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RevenueChart({ museums }: { museums: any[] }) {
  const data = museums.map((m) => ({
    name: m.title,
    revenue: m.totalRevenue || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Museum</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
