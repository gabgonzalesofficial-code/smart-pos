import { CreateProductDto, UpdateProductDto } from '@pos/shared';
export declare class ProductsService {
    findAll(search?: string, category?: string): Promise<any>;
    findOne(id: string): Promise<any>;
    findByBarcode(barcode: string): Promise<any>;
    create(createProductDto: CreateProductDto): Promise<any>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<any>;
    remove(id: string): Promise<any>;
    getCategories(): Promise<any>;
}
