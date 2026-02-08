'use client';

import { TableSkeleton } from '@/components/ui/LoadingSkeleton';

interface RecentTransactionsProps {
  sales?: any[];
  isLoading?: boolean;
}

const statusStyles: Record<string, string> = {
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  REFUNDED: 'bg-red-50 text-red-700 border-red-200',
  CANCELLED: 'bg-gray-50 text-gray-700 border-gray-200',
};

export default function RecentTransactions({ sales, isLoading }: RecentTransactionsProps) {
  if (isLoading) return <TableSkeleton rows={6} />;

  const data = sales ?? [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <p className="text-sm text-gray-500">Latest sales activity</p>
      </div>
      {data.length === 0 ? (
        <div className="px-6 pb-6 text-gray-400 text-sm">No transactions yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Receipt #</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Cashier</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Date & Time</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Items</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Payment</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.slice(0, 8).map((sale: any) => {
                const date = new Date(sale.createdAt);
                return (
                  <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.receiptNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {sale.cashier ? `${sale.cashier.firstName} ${sale.cashier.lastName}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="text-xs">{date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{sale.items?.length ?? 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{sale.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[sale.status] ?? statusStyles.COMPLETED}`}>
                        {sale.status?.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                      ${Number(sale.total).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
