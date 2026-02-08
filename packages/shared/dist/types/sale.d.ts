export declare enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD",
    GCASH = "GCASH",
    PAYMAYA = "PAYMAYA",
    OTHER = "OTHER"
}
export declare enum SaleStatus {
    COMPLETED = "COMPLETED",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED",
    PENDING = "PENDING"
}
export interface SaleItem {
    id?: string;
    productId: string;
    product?: {
        id: string;
        name: string;
        barcode: string;
        price: number;
    };
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
}
export interface CreateSaleDto {
    items: Omit<SaleItem, 'id' | 'product'>[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: PaymentMethod;
    amountPaid: number;
    change: number;
    notes?: string;
}
export interface Sale {
    id: string;
    receiptNumber: string;
    cashierId: string;
    cashier?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    items: SaleItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: PaymentMethod;
    amountPaid: number;
    change: number;
    status: SaleStatus;
    notes?: string;
    isSynced: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface SaleSummary {
    totalSales: number;
    totalTransactions: number;
    averageTransaction: number;
    dateRange: {
        from: string;
        to: string;
    };
}
