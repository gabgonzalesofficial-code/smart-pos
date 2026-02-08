import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto, user: any): Promise<any>;
    findAll(page?: string, limit?: string, dateFrom?: string, dateTo?: string): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findByReceiptNumber(receiptNumber: string): Promise<any>;
    findOne(id: string): Promise<any>;
    refund(id: string, reason?: string): Promise<any>;
}
