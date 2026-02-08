'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import WeeklySalesChart from '@/components/dashboard/WeeklySalesChart';
import TopProductsChart from '@/components/dashboard/TopProductsChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { useSalesSummary, useSalesByHour, useTopProducts, useSales, useStockLevels } from '@/hooks/use-api';

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useSalesSummary();
  const { data: hourly, isLoading: hourlyLoading } = useSalesByHour();
  const { data: topProducts, isLoading: topLoading } = useTopProducts(5);
  const { data: salesData, isLoading: salesLoading } = useSales(1, 8);
  const { data: stockLevels } = useStockLevels();

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome to your POS System">
      <StatsCards
        summary={summary}
        stockCount={stockLevels?.length ?? 0}
        isLoading={summaryLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        <WeeklySalesChart data={hourly} isLoading={hourlyLoading} />
        <TopProductsChart data={topProducts} isLoading={topLoading} />
      </div>

      <div className="mt-6">
        <RecentTransactions sales={salesData?.data} isLoading={salesLoading} />
      </div>
    </DashboardLayout>
  );
}
