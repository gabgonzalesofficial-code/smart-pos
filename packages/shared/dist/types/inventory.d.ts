export declare enum InventoryAction {
    STOCK_IN = "STOCK_IN",
    STOCK_OUT = "STOCK_OUT",
    ADJUSTMENT = "ADJUSTMENT",
    SALE = "SALE",
    RETURN = "RETURN",
    TRANSFER_IN = "TRANSFER_IN",
    TRANSFER_OUT = "TRANSFER_OUT"
}
export interface InventoryLog {
    id: string;
    productId: string;
    product?: {
        id: string;
        name: string;
        barcode: string;
    };
    quantity: number;
    action: InventoryAction;
    notes?: string;
    reference?: string;
    userId?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateInventoryLogDto {
    productId: string;
    quantity: number;
    action: InventoryAction;
    notes?: string;
    reference?: string;
}
export interface StockLevel {
    productId: string;
    product: {
        id: string;
        name: string;
        barcode: string;
    };
    currentStock: number;
    lowStockThreshold: number;
    isLowStock: boolean;
}
