"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("@pos/prisma");
let InventoryService = class InventoryService {
    async createLog(createLogDto) {
        return prisma_1.prisma.inventoryLog.create({
            data: createLogDto,
            include: {
                product: true,
            },
        });
    }
    async findAll(productId, action, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const where = {};
        if (productId)
            where.productId = productId;
        if (action)
            where.action = action;
        const [data, total] = await Promise.all([
            prisma_1.prisma.inventoryLog.findMany({
                where,
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            barcode: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma_1.prisma.inventoryLog.count({ where }),
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
    async getCurrentStock(productId) {
        const logs = await prisma_1.prisma.inventoryLog.findMany({
            where: { productId },
            orderBy: { createdAt: 'asc' },
        });
        return logs.reduce((stock, log) => {
            if (log.action === 'STOCK_IN' || log.action === 'RETURN' || log.action === 'TRANSFER_IN') {
                return stock + log.quantity;
            }
            else if (log.action === 'STOCK_OUT' || log.action === 'SALE' || log.action === 'TRANSFER_OUT') {
                return stock - log.quantity;
            }
            else if (log.action === 'ADJUSTMENT') {
                return stock + log.quantity;
            }
            return stock;
        }, 0);
    }
    async getStockLevels(lowStockThreshold = 10) {
        const products = await prisma_1.prisma.product.findMany({
            where: {
                trackInventory: true,
                isActive: true,
            },
        });
        const stockLevels = await Promise.all(products.map(async (product) => {
            const currentStock = await this.getCurrentStock(product.id);
            return {
                productId: product.id,
                product: {
                    id: product.id,
                    name: product.name,
                    barcode: product.barcode,
                },
                currentStock,
                lowStockThreshold,
                isLowStock: currentStock <= lowStockThreshold,
            };
        }));
        return stockLevels;
    }
    async getLowStockProducts(threshold = 10) {
        const stockLevels = await this.getStockLevels(threshold);
        return stockLevels.filter((level) => level.isLowStock);
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)()
], InventoryService);
//# sourceMappingURL=inventory.service.js.map