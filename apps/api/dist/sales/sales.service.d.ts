import { CreateSaleDto } from '@pos/shared';
import { ProductsService } from '../products/products.service';
import { InventoryService } from '../inventory/inventory.service';
export declare class SalesService {
    private productsService;
    private inventoryService;
    constructor(productsService: ProductsService, inventoryService: InventoryService);
    create(createSaleDto: CreateSaleDto, cashierId: string): Promise<any>;
    findAll(page?: number, limit?: number, dateFrom?: string, dateTo?: string): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    findByReceiptNumber(receiptNumber: string): Promise<any>;
    refund(id: string, reason?: string): Promise<any>;
    private generateReceiptNumber;
}
