// components/museum-admin/RevenueChart.tsx
'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingUp } from 'lucide-react';

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/50 bg-background/90 backdrop-blur-md px-3 py-2.5 shadow-xl text-xs">
      <p className="font-semibold text-foreground mb-1 max-w-[160px] truncate">{label}</p>
      <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
        <IndianRupee className="w-3 h-3" />
        {payload[0].value.toLocaleString('en-IN')}
      </div>
    </div>
  );
}

export function RevenueChart({ museums }: { museums: any[] }) {
  const data = museums.map(m => ({
    name: m.title,
    revenue: m.totalRevenue || 0,
  }));

  const total = data.reduce((s, d) => s + d.revenue, 0);
  const max = Math.max(...data.map(d => d.revenue), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Revenue by Museum</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total ₹{total.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pt-4 pb-3 h-[280px]">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <IndianRupee className="w-7 h-7 opacity-20" />
            <p className="text-xs">No revenue data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.35} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="hsl(var(--border))"
                strokeOpacity={0.3}
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                interval={0}
                tickFormatter={v => v.length > 10 ? v.slice(0, 10) + '…' : v}
              />

              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4, radius: 6 }}
              />

              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.revenue === max ? 'url(#revenueGrad)' : 'hsl(var(--muted))'}
                    fillOpacity={entry.revenue === max ? 1 : 0.5}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend row */}
      {data.length > 0 && (
        <div className="px-5 pb-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className={`w-2 h-2 rounded-full ${d.revenue === max ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
              <span className="truncate max-w-[100px]">{d.name}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}