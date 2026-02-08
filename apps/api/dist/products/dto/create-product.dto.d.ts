export declare class CreateProductDto {
    barcode: string;
    name: string;
    description?: string;
    price: number;
    cost?: number;
    category?: string;
    imageUrl?: string;
    trackInventory?: boolean;
    supplierId?: string;
}
