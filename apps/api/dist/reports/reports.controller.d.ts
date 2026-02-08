import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSalesSummary(dateFrom?: string, dateTo?: string): Promise<{
        totalSales: number;
        totalTransactions: any;
        averageTransaction: number;
        dateRange: {
            from: string;
            to: string;
        };
    }>;
    getTopProducts(limit?: string, dateFrom?: string, dateTo?: string): Promise<{
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
