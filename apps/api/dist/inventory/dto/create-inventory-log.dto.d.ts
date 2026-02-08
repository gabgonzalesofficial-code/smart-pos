import { InventoryAction } from '@pos/shared';
export declare class CreateInventoryLogDto {
    productId: string;
    quantity: number;
    action: InventoryAction;
    notes?: string;
    reference?: string;
}
