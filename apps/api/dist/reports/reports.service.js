"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("@pos/prisma");
let ReportsService = class ReportsService {
    async getSalesSummary(dateFrom, dateTo) {
        const where = { status: 'COMPLETED' };
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.createdAt.lte = new Date(dateTo);
        }
        const [totalSales, totalTransactions, sales] = await Promise.all([
            prisma_1.prisma.sale.aggregate({
                where,
                _sum: { total: true },
            }),
            prisma_1.prisma.sale.count({ where }),
            prisma_1.prisma.sale.findMany({
                where,
                select: { total: true },
            }),
        ]);
        const total = Number(totalSales._sum.total || 0);
        const count = totalTransactions;
        const average = count > 0 ? total / count : 0;
        return {
            totalSales: total,
            totalTransactions: count,
            averageTransaction: average,
            dateRange: {
                from: dateFrom || new Date().toISOString().split('T')[0],
                to: dateTo || new Date().toISOString().split('T')[0],
            },
        };
    }
    async getTopProducts(limit = 10, dateFrom, dateTo) {
        const where = { status: 'COMPLETED' };
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.createdAt.lte = new Date(dateTo);
        }
        const sales = await prisma_1.prisma.sale.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        const productMap = new Map();
        sales.forEach((sale) => {
            sale.items.forEach((item) => {
                const productId = item.productId;
                const existing = productMap.get(productId) || {
                    product: item.product,
                    quantity: 0,
                    revenue: 0,
                };
                existing.quantity += item.quantity;
                existing.revenue += Number(item.total);
                productMap.set(productId, existing);
            });
        });
        return Array.from(productMap.values())
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, limit);
    }
    async getSalesByHour(date) {
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
        const sales = await prisma_1.prisma.sale.findMany({
            where: {
                status: 'COMPLETED',
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            select: {
                createdAt: true,
                total: true,
            },
        });
        const hourlyData = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            count: 0,
            revenue: 0,
        }));
        sales.forEach((sale) => {
            const hour = new Date(sale.createdAt).getHours();
            hourlyData[hour].count++;
            hourlyData[hour].revenue += Number(sale.total);
        });
        return hourlyData;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)()
], ReportsService);
//# sourceMappingURL=reports.service.js.map