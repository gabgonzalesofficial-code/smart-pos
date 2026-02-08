import { CreateInventoryLogDto, InventoryAction } from '@pos/shared';
export declare class InventoryService {
    createLog(createLogDto: CreateInventoryLogDto): Promise<any>;
    findAll(productId?: string, action?: InventoryAction, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getCurrentStock(productId: string): Promise<number>;
    getStockLevels(lowStockThreshold?: number): Promise<any[]>;
    getLowStockProducts(threshold?: number): Promise<any[]>;
}
