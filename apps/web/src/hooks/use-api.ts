'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ============ PRODUCTS ============

export function useProducts(search?: string, category?: string) {
  return useQuery({
    queryKey: ['products', search, category],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await apiClient.get('/products', { params });
      return res.data as any[];
    },
  });
}

export function useProduct(id: string | null) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await apiClient.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const res = await apiClient.get('/products/categories');
      return res.data as string[];
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post('/products', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['productCategories'] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiClient.patch(`/products/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ============ SALES ============

export function useSales(page = 1, limit = 50, dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: ['sales', page, limit, dateFrom, dateTo],
    queryFn: async () => {
      const params: Record<string, string> = { page: String(page), limit: String(limit) };
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      const res = await apiClient.get('/sales', { params });
      return res.data as { data: any[]; meta: { page: number; limit: number; total: number; totalPages: number } };
    },
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post('/sales', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales'] });
      qc.invalidateQueries({ queryKey: ['salesSummary'] });
      qc.invalidateQueries({ queryKey: ['topProducts'] });
      qc.invalidateQueries({ queryKey: ['salesByHour'] });
      qc.invalidateQueries({ queryKey: ['stockLevels'] });
      qc.invalidateQueries({ queryKey: ['lowStock'] });
    },
  });
}

export function useRefundSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const res = await apiClient.post(`/sales/${id}/refund`, { reason });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales'] });
      qc.invalidateQueries({ queryKey: ['salesSummary'] });
      qc.invalidateQueries({ queryKey: ['stockLevels'] });
    },
  });
}

// ============ INVENTORY ============

export function useStockLevels(threshold = 10) {
  return useQuery({
    queryKey: ['stockLevels', threshold],
    queryFn: async () => {
      const res = await apiClient.get('/inventory/stock-levels', { params: { threshold: String(threshold) } });
      return res.data as { productId: string; product: { id: string; name: string; barcode: string }; currentStock: number; lowStockThreshold: number; isLowStock: boolean }[];
    },
  });
}

export function useLowStock(threshold = 10) {
  return useQuery({
    queryKey: ['lowStock', threshold],
    queryFn: async () => {
      const res = await apiClient.get('/inventory/low-stock', { params: { threshold: String(threshold) } });
      return res.data as any[];
    },
  });
}

export function useInventoryLogs(productId?: string, action?: string, page = 1, limit = 50) {
  return useQuery({
    queryKey: ['inventoryLogs', productId, action, page, limit],
    queryFn: async () => {
      const params: Record<string, string> = { page: String(page), limit: String(limit) };
      if (productId) params.productId = productId;
      if (action) params.action = action;
      const res = await apiClient.get('/inventory/logs', { params });
      return res.data as { data: any[]; meta: { page: number; limit: number; total: number; totalPages: number } };
    },
  });
}

export function useCreateInventoryLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post('/inventory/logs', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventoryLogs'] });
      qc.invalidateQueries({ queryKey: ['stockLevels'] });
      qc.invalidateQueries({ queryKey: ['lowStock'] });
    },
  });
}

// ============ USER PROFILE ============

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { firstName?: string; lastName?: string; email?: string }) => {
      const res = await apiClient.patch('/users/me', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await apiClient.patch('/users/me/password', data);
      return res.data;
    },
  });
}

// ============ REPORTS ============

export function useSalesSummary(dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: ['salesSummary', dateFrom, dateTo],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      const res = await apiClient.get('/reports/sales-summary', { params });
      return res.data as { totalSales: number; totalTransactions: number; averageTransaction: number; dateRange: { from: string; to: string } };
    },
  });
}

export function useTopProducts(limit = 10, dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: ['topProducts', limit, dateFrom, dateTo],
    queryFn: async () => {
      const params: Record<string, string> = { limit: String(limit) };
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      const res = await apiClient.get('/reports/top-products', { params });
      return res.data as { product: any; quantity: number; revenue: number }[];
    },
  });
}

export function useSalesByHour(date?: string) {
  return useQuery({
    queryKey: ['salesByHour', date],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (date) params.date = date;
      const res = await apiClient.get('/reports/sales-by-hour', { params });
      return res.data as { hour: number; count: number; revenue: number }[];
    },
  });
}
