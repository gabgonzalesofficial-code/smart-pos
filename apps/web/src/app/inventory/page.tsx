'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Modal from '@/components/ui/Modal';
import { useStockLevels, useLowStock, useProducts, useCreateInventoryLog, useInventoryLogs } from '@/hooks/use-api';
import { TableSkeleton, CardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function InventoryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ productId: '', quantity: '', action: 'STOCK_IN', notes: '' });
  const [logPage, setLogPage] = useState(1);

  const { data: stockLevels, isLoading: stockLoading } = useStockLevels();
  const { data: lowStock } = useLowStock();
  const { data: products } = useProducts();
  const { data: logsData, isLoading: logsLoading } = useInventoryLogs(undefined, undefined, logPage, 10);
  const createLog = useCreateInventoryLog();

  const totalProducts = stockLevels?.length ?? 0;
  const lowStockCount = lowStock?.length ?? 0;
  const outOfStockCount = stockLevels?.filter((s: any) => s.currentStock <= 0).length ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLog.mutateAsync({
      productId: form.productId,
      quantity: parseInt(form.quantity),
      action: form.action,
      notes: form.notes || undefined,
    });
    setForm({ productId: '', quantity: '', action: 'STOCK_IN', notes: '' });
    setModalOpen(false);
  };

  const statusStyle = (s: any) => {
    if (s.currentStock <= 0) return 'bg-red-50 text-red-700 border-red-200';
    if (s.isLowStock) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };
  const statusLabel = (s: any) => {
    if (s.currentStock <= 0) return 'Out of Stock';
    if (s.isLowStock) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <DashboardLayout title="Inventory" subtitle="Track and manage stock levels">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {stockLoading ? (
          <>{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</>
        ) : (
          <>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /><p className="text-sm font-medium text-gray-500">Low Stock Items</p></div>
              <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><p className="text-sm font-medium text-gray-500">Out of Stock</p></div>
              <p className="text-2xl font-bold text-red-600 mt-1">{outOfStockCount}</p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Stock Levels</h3>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Stock In
        </button>
      </div>

      {/* Stock Levels Table */}
      {stockLoading ? <TableSkeleton rows={6} /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Product</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Barcode</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Current Stock</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Threshold</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(stockLevels ?? []).map((s: any) => (
                  <tr key={s.productId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{s.product.barcode}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">{s.currentStock}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.lowStockThreshold}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle(s)}`}>{statusLabel(s)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Logs */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Activity Log</h3>
      {logsLoading ? <TableSkeleton rows={5} /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Product</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Action</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Quantity</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Notes</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(logsData?.data ?? []).map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{log.product?.name ?? '-'}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{log.action.replace('_', ' ')}</td>
                    <td className={`px-6 py-3 text-sm font-semibold ${log.quantity >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{log.quantity >= 0 ? '+' : ''}{log.quantity}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{log.notes || log.reference || '-'}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {logsData && logsData.meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
              <button onClick={() => setLogPage(p => Math.max(1, p - 1))} disabled={logPage <= 1} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">Previous</button>
              <span className="text-sm text-gray-500">Page {logPage} of {logsData.meta.totalPages}</span>
              <button onClick={() => setLogPage(p => Math.min(logsData.meta.totalPages, p + 1))} disabled={logPage >= logsData.meta.totalPages} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      )}

      {/* Stock In Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Inventory">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
            <select required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Select a product</option>
              {(products ?? []).map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.barcode})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action *</label>
              <select value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="STOCK_IN">Stock In</option>
                <option value="STOCK_OUT">Stock Out</option>
                <option value="ADJUSTMENT">Adjustment</option>
                <option value="RETURN">Return</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input type="number" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={createLog.isPending} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {createLog.isPending ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
