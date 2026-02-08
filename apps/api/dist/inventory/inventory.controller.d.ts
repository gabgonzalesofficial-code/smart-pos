import { InventoryService } from './inventory.service';
import { CreateInventoryLogDto } from './dto/create-inventory-log.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    createLog(createLogDto: CreateInventoryLogDto): Promise<any>;
    findAll(productId?: string, action?: string, page?: string, limit?: string): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getCurrentStock(productId: string): Promise<number>;
    getStockLevels(threshold?: string): Promise<any[]>;
    getLowStockProducts(threshold?: string): Promise<any[]>;
}
