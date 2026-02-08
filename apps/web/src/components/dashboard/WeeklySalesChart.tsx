'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

interface WeeklySalesChartProps {
  data?: { hour: number; count: number; revenue: number }[];
  isLoading?: boolean;
}

export default function WeeklySalesChart({ data, isLoading }: WeeklySalesChartProps) {
  if (isLoading) return <ChartSkeleton />;

  // Group hours into time slots for a cleaner chart
  const timeSlots = [
    { label: '8-10am', hours: [8, 9] },
    { label: '10-12pm', hours: [10, 11] },
    { label: '12-2pm', hours: [12, 13] },
    { label: '2-4pm', hours: [14, 15] },
    { label: '4-6pm', hours: [16, 17] },
    { label: '6-8pm', hours: [18, 19] },
    { label: '8-10pm', hours: [20, 21] },
  ];

  const chartData = timeSlots.map(slot => {
    const revenue = data
      ? slot.hours.reduce((sum, h) => {
          const entry = data.find(d => d.hour === h);
          return sum + (entry?.revenue ?? 0);
        }, 0)
      : 0;
    return { slot: slot.label, revenue: parseFloat(revenue.toFixed(2)) };
  });

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sales by Time</h3>
        <p className="text-sm text-gray-500">Revenue distribution today</p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="slot" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${v}`} width={55} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
              formatter={(value?: number) => [`$${(value ?? 0)  .toLocaleString()}`, 'Revenue']}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorRev)" dot={false} activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
