'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Modal from '@/components/ui/Modal';
import { useSales, useProducts, useCreateSale, useRefundSale } from '@/hooks/use-api';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';

interface CartItem { productId: string; name: string; unitPrice: number; quantity: number; discount: number; total: number; }

const statusStyles: Record<string, string> = {
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  REFUNDED: 'bg-red-50 text-red-700 border-red-200',
  CANCELLED: 'bg-gray-50 text-gray-700 border-gray-200',
};

export default function SalesPage() {
  const [page, setPage] = useState(1);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [amountPaid, setAmountPaid] = useState('');

  const { data: salesData, isLoading } = useSales(page, 10);
  const { data: products } = useProducts(productSearch || undefined);
  const createSale = useCreateSale();
  const refundSale = useRefundSale();

  const subtotal = cart.reduce((s, i) => s + i.total, 0);
  const tax = parseFloat((subtotal * 0.12).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));
  const change = Math.max(0, parseFloat((Number(amountPaid) - total).toFixed(2)));

  const addToCart = (product: any) => {
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      setCart(cart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1, total: parseFloat(((i.quantity + 1) * i.unitPrice).toFixed(2)) } : i));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, unitPrice: Number(product.price), quantity: 1, discount: 0, total: Number(product.price) }]);
    }
    setProductSearch('');
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) { setCart(cart.filter(i => i.productId !== productId)); return; }
    setCart(cart.map(i => i.productId === productId ? { ...i, quantity: qty, total: parseFloat((qty * i.unitPrice).toFixed(2)) } : i));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const paid = paymentMethod === 'CASH' ? Number(amountPaid) : total;
    if (paid < total) { alert('Insufficient payment amount'); return; }
    await createSale.mutateAsync({
      items: cart.map(({ productId, quantity, unitPrice, discount, total }) => ({ productId, quantity, unitPrice, discount, total })),
      subtotal, discount: 0, tax, total, paymentMethod, amountPaid: paid, change: parseFloat((paid - total).toFixed(2)),
    });
    setCart([]); setAmountPaid(''); setSaleModalOpen(false);
  };

  const handleRefund = async (saleId: string) => {
    if (confirm('Are you sure you want to refund this sale?')) {
      await refundSale.mutateAsync({ id: saleId, reason: 'Customer request' });
    }
  };

  return (
    <DashboardLayout title="Sales" subtitle="Manage sales and transactions">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${salesData?.data?.reduce((s: number, sale: any) => sale.status === 'COMPLETED' ? s + Number(sale.total) : s, 0).toFixed(2) ?? '0.00'}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Transactions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{salesData?.meta?.total ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Page</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{page} of {salesData?.meta?.totalPages ?? 1}</p>
        </div>
      </div>

      <div className="mb-6">
        <button onClick={() => setSaleModalOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Sale
        </button>
      </div>

      {/* Sales Table */}
      {isLoading ? <TableSkeleton rows={6} /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Receipt #</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Cashier</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Items</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Payment</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Total</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(salesData?.data ?? []).map((sale: any) => (
                  <tr key={sale.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.receiptNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{sale.cashier ? `${sale.cashier.firstName} ${sale.cashier.lastName}` : '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(sale.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{sale.items?.length ?? 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{sale.paymentMethod}</td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[sale.status] ?? ''}`}>{sale.status?.toLowerCase()}</span></td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">${Number(sale.total).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      {sale.status === 'COMPLETED' && (
                        <button onClick={() => handleRefund(sale.id)} className="text-xs text-red-600 hover:text-red-800 font-medium">Refund</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {salesData && salesData.meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">Previous</button>
              <span className="text-sm text-gray-500">Page {page} of {salesData.meta.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(salesData.meta.totalPages, p + 1))} disabled={page >= salesData.meta.totalPages} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      )}

      {/* New Sale Modal */}
      <Modal isOpen={saleModalOpen} onClose={() => setSaleModalOpen(false)} title="New Sale" size="xl">
        <div className="grid grid-cols-5 gap-6">
          {/* Product Search */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
            <input type="text" placeholder="Type product name..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" />
            {productSearch && products && products.length > 0 && (
              <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {products.slice(0, 8).map((p: any) => (
                  <button key={p.id} onClick={() => addToCart(p)} className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-blue-50 transition-colors text-left">
                    <span className="font-medium text-gray-900">{p.name}</span>
                    <span className="text-gray-500">${Number(p.price).toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Cart */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Cart ({cart.length} items)</h4>
              {cart.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">Add products to start a sale</p>
              ) : (
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.productId} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">${item.unitPrice.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-100">-</button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-100">+</button>
                        <span className="text-sm font-semibold w-16 text-right">${item.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Panel */}
          <div className="col-span-2 bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax (12%)</span><span className="font-medium">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="GCASH">GCash</option>
                <option value="PAYMAYA">PayMaya</option>
              </select>
            </div>

            {paymentMethod === 'CASH' && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                <input type="number" step="0.01" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {Number(amountPaid) > 0 && <p className="text-sm mt-1">Change: <span className="font-bold text-emerald-600">${change.toFixed(2)}</span></p>}
              </div>
            )}

            <button onClick={handleCheckout} disabled={cart.length === 0 || createSale.isPending}
              className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
              {createSale.isPending ? 'Processing...' : `Checkout $${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
