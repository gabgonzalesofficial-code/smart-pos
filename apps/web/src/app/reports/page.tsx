'use client';

import { useState, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSalesSummary, useTopProducts, useSalesByHour, useSales } from '@/hooks/use-api';
import { CardSkeleton, ChartSkeleton } from '@/components/ui/LoadingSkeleton';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, CartesianGrid,
} from 'recharts';

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: summary, isLoading: summaryLoading } = useSalesSummary(dateFrom || undefined, dateTo || undefined);
  const { data: topProducts, isLoading: topLoading } = useTopProducts(10, dateFrom || undefined, dateTo || undefined);
  const { data: hourlyData, isLoading: hourlyLoading } = useSalesByHour();
  const { data: salesData } = useSales(1, 500);

  const topChartData = (topProducts ?? []).map(d => ({ name: d.product?.name ?? 'Unknown', quantity: d.quantity, revenue: d.revenue }));

  const hourlyChartData = (hourlyData ?? [])
    .filter(h => h.count > 0 || h.revenue > 0)
    .map(h => ({ hour: `${h.hour}:00`, revenue: parseFloat(h.revenue.toFixed(2)), count: h.count }));

  // CSV Export handlers
  const exportSalesSummary = useCallback(() => {
    if (!summary) return;
    downloadCSV(
      `sales-summary${dateFrom ? `-from-${dateFrom}` : ''}${dateTo ? `-to-${dateTo}` : ''}.csv`,
      ['Metric', 'Value'],
      [
        ['Total Revenue', `$${(summary.totalSales ?? 0).toFixed(2)}`],
        ['Total Transactions', String(summary.totalTransactions ?? 0)],
        ['Average Transaction', `$${(summary.averageTransaction ?? 0).toFixed(2)}`],
      ],
    );
  }, [summary, dateFrom, dateTo]);

  const exportTopProducts = useCallback(() => {
    if (!topChartData.length) return;
    downloadCSV(
      `top-products${dateFrom ? `-from-${dateFrom}` : ''}${dateTo ? `-to-${dateTo}` : ''}.csv`,
      ['Rank', 'Product', 'Units Sold', 'Revenue'],
      topChartData.map((item, idx) => [String(idx + 1), item.name, String(item.quantity), `$${item.revenue.toFixed(2)}`]),
    );
  }, [topChartData, dateFrom, dateTo]);

  const exportHourlySales = useCallback(() => {
    if (!hourlyChartData.length) return;
    downloadCSV(
      'sales-by-hour.csv',
      ['Hour', 'Revenue', 'Transactions'],
      hourlyChartData.map(h => [h.hour, `$${h.revenue.toFixed(2)}`, String(h.count)]),
    );
  }, [hourlyChartData]);

  const exportAllTransactions = useCallback(() => {
    const sales = salesData?.data ?? salesData ?? [];
    if (!Array.isArray(sales) || sales.length === 0) return;
    downloadCSV(
      `transactions${dateFrom ? `-from-${dateFrom}` : ''}${dateTo ? `-to-${dateTo}` : ''}.csv`,
      ['Sale ID', 'Date', 'Customer', 'Items', 'Total', 'Payment Method', 'Status'],
      sales.map((s: any) => [
        s.id,
        new Date(s.createdAt).toLocaleString(),
        s.customerName || 'Walk-in',
        String(s.items?.length ?? 0),
        `$${Number(s.totalAmount).toFixed(2)}`,
        s.paymentMethod ?? '',
        s.status ?? '',
      ]),
    );
  }, [salesData, dateFrom, dateTo]);

  return (
    <DashboardLayout title="Reports" subtitle="Analytics and business insights">
      {/* Date Filter & Export All */}
      <div className="flex items-end gap-3 mb-6 flex-wrap">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {(dateFrom || dateTo) && (
          <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="text-sm text-blue-600 hover:text-blue-800 font-medium pb-2">Clear</button>
        )}

        <div className="ml-auto flex gap-2">
          <ExportDropdown
            onExportSummary={exportSalesSummary}
            onExportProducts={exportTopProducts}
            onExportHourly={exportHourlySales}
            onExportTransactions={exportAllTransactions}
          />
        </div>
      </div>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {summaryLoading ? (
          <>{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</>
        ) : (
          <>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${(summary?.totalSales ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <p className="text-sm font-medium text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{summary?.totalTransactions ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <p className="text-sm font-medium text-gray-500">Average Transaction</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${(summary?.averageTransaction ?? 0).toFixed(2)}</p>
            </div>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products */}
        {topLoading ? <ChartSkeleton /> : (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              {topChartData.length > 0 && (
                <button onClick={exportTopProducts} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1" title="Export as CSV">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  CSV
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">By quantity sold</p>
            {topChartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400">No data for selected period</div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topChartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={130} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                      formatter={(value: number, name: string) => [name === 'quantity' ? `${value} units` : `$${value.toFixed(2)}`, name === 'quantity' ? 'Sold' : 'Revenue']} cursor={{ fill: '#f1f5f9' }} />
                    <Bar dataKey="quantity" radius={[0, 6, 6, 0]} barSize={24}>
                      {topChartData.map((_, i) => <Cell key={i} fill="#10b981" fillOpacity={1 - i * 0.08} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Sales by Hour */}
        {hourlyLoading ? <ChartSkeleton /> : (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-gray-900">Sales by Hour</h3>
              {hourlyChartData.length > 0 && (
                <button onClick={exportHourlySales} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1" title="Export as CSV">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  CSV
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">Today&apos;s revenue distribution</p>
            {hourlyChartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400">No sales today yet</div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${v}`} width={55} />
                    <Tooltip contentStyle={{
                            backgroundColor: '#1e293b',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '13px',
                          }}
                          formatter={(value?: number, name?: string) => [
                            name === 'revenue'
                              ? `$${(value ?? 0).toFixed(2)}`
                              : (value ?? 0),
                            name === 'revenue' ? 'Revenue' : 'Transactions',
                          ]}
                        />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#colorHourly)" dot={false} activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Revenue Table from Top Products */}
      {!topLoading && topChartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Product Revenue Breakdown</h3>
              <p className="text-sm text-gray-500">Detailed view of top products</p>
            </div>
            <button onClick={exportTopProducts} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg" title="Export as CSV">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">#</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Product</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Units Sold</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topChartData.map((item, idx) => (
                  <tr key={item.name} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 text-sm text-gray-500">{idx + 1}</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-700 text-right">{item.quantity}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">${item.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// Dropdown component for export options
function ExportDropdown({ onExportSummary, onExportProducts, onExportHourly, onExportTransactions }: {
  onExportSummary: () => void;
  onExportProducts: () => void;
  onExportHourly: () => void;
  onExportTransactions: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export CSV
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
            <button onClick={() => { onExportSummary(); setOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Sales Summary
            </button>
            <button onClick={() => { onExportProducts(); setOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Top Products
            </button>
            <button onClick={() => { onExportHourly(); setOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Hourly Sales
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button onClick={() => { onExportTransactions(); setOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> All Transactions
            </button>
          </div>
        </>
      )}
    </div>
  );
}
