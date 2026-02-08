"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("@pos/prisma");
const shared_1 = require("@pos/shared");
const products_service_1 = require("../products/products.service");
const inventory_service_1 = require("../inventory/inventory.service");
let SalesService = class SalesService {
    constructor(productsService, inventoryService) {
        this.productsService = productsService;
        this.inventoryService = inventoryService;
    }
    async create(createSaleDto, cashierId) {
        const receiptNumber = this.generateReceiptNumber();
        for (const item of createSaleDto.items) {
            const product = await this.productsService.findOne(item.productId);
            if (!product.isActive) {
                throw new common_1.BadRequestException(`Product ${product.name} is not active`);
            }
            if (product.trackInventory) {
                const stock = await this.inventoryService.getCurrentStock(item.productId);
                if (stock < item.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for ${product.name}. Available: ${stock}, Requested: ${item.quantity}`);
                }
            }
        }
        const sale = await prisma_1.prisma.sale.create({
            data: {
                receiptNumber,
                cashierId,
                subtotal: createSaleDto.subtotal,
                discount: createSaleDto.discount,
                tax: createSaleDto.tax,
                total: createSaleDto.total,
                paymentMethod: createSaleDto.paymentMethod,
                amountPaid: createSaleDto.amountPaid,
                change: createSaleDto.change,
                notes: createSaleDto.notes,
                status: shared_1.SaleStatus.COMPLETED,
                items: {
                    create: createSaleDto.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount,
                        total: item.total,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                cashier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        for (const item of createSaleDto.items) {
            const product = await this.productsService.findOne(item.productId);
            if (product.trackInventory) {
                await this.inventoryService.createLog({
                    productId: item.productId,
                    quantity: -item.quantity,
                    action: shared_1.InventoryAction.SALE,
                    reference: receiptNumber,
                    notes: `Sale: ${receiptNumber}`,
                });
            }
        }
        return sale;
    }
    async findAll(page = 1, limit = 50, dateFrom, dateTo) {
        const skip = (page - 1) * limit;
        const where = {};
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.createdAt.lte = new Date(dateTo);
        }
        const [data, total] = await Promise.all([
            prisma_1.prisma.sale.findMany({
                where,
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    cashier: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma_1.prisma.sale.count({ where }),
        ]);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        return prisma_1.prisma.sale.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                cashier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
    async findByReceiptNumber(receiptNumber) {
        return prisma_1.prisma.sale.findUnique({
            where: { receiptNumber },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                cashier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
    async refund(id, reason) {
        const sale = await this.findOne(id);
        if (sale.status === shared_1.SaleStatus.REFUNDED) {
            throw new common_1.BadRequestException('Sale already refunded');
        }
        if (sale.status === shared_1.SaleStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot refund a cancelled sale');
        }
        const refundedSale = await prisma_1.prisma.sale.update({
            where: { id },
            data: {
                status: shared_1.SaleStatus.REFUNDED,
                notes: reason || 'Refunded',
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        for (const item of sale.items) {
            const product = await this.productsService.findOne(item.productId);
            if (product.trackInventory) {
                await this.inventoryService.createLog({
                    productId: item.productId,
                    quantity: item.quantity,
                    action: shared_1.InventoryAction.RETURN,
                    reference: sale.receiptNumber,
                    notes: `Refund: ${sale.receiptNumber}`,
                });
            }
        }
        return refundedSale;
    }
    generateReceiptNumber() {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `RCP-${dateStr}-${randomStr}`;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        inventory_service_1.InventoryService])
], SalesService);
//# sourceMappingURL=sales.service.js.map