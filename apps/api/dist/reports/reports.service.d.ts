export declare class ReportsService {
    getSalesSummary(dateFrom?: string, dateTo?: string): Promise<{
        totalSales: number;
        totalTransactions: any;
        averageTransaction: number;
        dateRange: {
            from: string;
            to: string;
        };
    }>;
    getTopProducts(limit?: number, dateFrom?: string, dateTo?: string): Promise<{
        product: any;
        quantity: number;
        revenue: number;
    }[]>;
    getSalesByHour(date?: string): Promise<{
        hour: number;
        count: number;
        revenue: number;
    }[]>;
}
