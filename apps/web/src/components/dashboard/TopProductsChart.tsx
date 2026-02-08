'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

interface TopProductsChartProps {
  data?: { product: any; quantity: number; revenue: number }[];
  isLoading?: boolean;
}

export default function TopProductsChart({ data, isLoading }: TopProductsChartProps) {
  if (isLoading) return <ChartSkeleton />;

  const chartData = (data ?? []).map(d => ({
    name: d.product?.name ?? 'Unknown',
    sales: d.quantity,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
        <p className="text-sm text-gray-500 mb-4">Best selling items</p>
        <div className="h-[280px] flex items-center justify-center text-gray-400">No sales data yet</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
        <p className="text-sm text-gray-500">Best selling items</p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={130} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
              formatter={(value?: number) => [`${value ?? 0} units`, 'Sold']}
              cursor={{ fill: '#f1f5f9' }}
            />
            <Bar dataKey="sales" radius={[0, 6, 6, 0]} barSize={28}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#34d399'} fillOpacity={1 - index * 0.12} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
