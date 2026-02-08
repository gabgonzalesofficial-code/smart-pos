export interface Product {
    id: string;
    barcode: string;
    name: string;
    description?: string;
    price: number;
    cost?: number;
    category?: string;
    imageUrl?: string;
    isActive: boolean;
    trackInventory: boolean;
    supplierId?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateProductDto {
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
export interface UpdateProductDto extends Partial<CreateProductDto> {
    isActive?: boolean;
}
export interface ProductWithStock extends Product {
    currentStock?: number;
}
