import { PaymentMethod } from '@pos/shared';
declare class SaleItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
}
export declare class CreateSaleDto {
    items: SaleItemDto[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: PaymentMethod;
    amountPaid: number;
    change: number;
    notes?: string;
}
export {};
