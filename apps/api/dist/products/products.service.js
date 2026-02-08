"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("@pos/prisma");
let ProductsService = class ProductsService {
    async findAll(search, category) {
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { barcode: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (category) {
            where.category = category;
        }
        return prisma_1.prisma.product.findMany({
            where,
            include: {
                supplier: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const product = await prisma_1.prisma.product.findUnique({
            where: { id },
            include: {
                supplier: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findByBarcode(barcode) {
        return prisma_1.prisma.product.findUnique({
            where: { barcode },
            include: {
                supplier: true,
            },
        });
    }
    async create(createProductDto) {
        return prisma_1.prisma.product.create({
            data: createProductDto,
            include: {
                supplier: true,
            },
        });
    }
    async update(id, updateProductDto) {
        await this.findOne(id);
        return prisma_1.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: {
                supplier: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return prisma_1.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getCategories() {
        const products = await prisma_1.prisma.product.findMany({
            where: { category: { not: null } },
            select: { category: true },
            distinct: ['category'],
        });
        return products.map((p) => p.category).filter(Boolean);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map