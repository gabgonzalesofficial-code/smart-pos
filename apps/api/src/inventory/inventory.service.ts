import { Injectable } from '@nestjs/common';
import { prisma } from '@pos/prisma';
import { CreateInventoryLogDto, InventoryAction } from '@pos/shared';

@Injectable()
export class InventoryService {
  async createLog(createLogDto: CreateInventoryLogDto) {
    return prisma.inventoryLog.create({
      data: createLogDto,
      include: {
        product: true,
      },
    });
  }

  async findAll(productId?: string, action?: InventoryAction, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (productId) where.productId = productId;
    if (action) where.action = action;

    const [data, total] = await Promise.all([
      prisma.inventoryLog.findMany({
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
      prisma.inventoryLog.count({ where }),
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

  async getCurrentStock(productId: string): Promise<number> {
    const logs = await prisma.inventoryLog.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
    });

    return logs.reduce((stock, log) => {
      if (log.action === 'STOCK_IN' || log.action === 'RETURN' || log.action === 'TRANSFER_IN') {
        return stock + log.quantity;
      } else if (log.action === 'STOCK_OUT' || log.action === 'SALE' || log.action === 'TRANSFER_OUT') {
        return stock - log.quantity;
      } else if (log.action === 'ADJUSTMENT') {
        return stock + log.quantity; // Can be positive or negative
      }
      return stock;
    }, 0);
  }

  async getStockLevels(lowStockThreshold = 10) {
    const products = await prisma.product.findMany({
      where: {
        trackInventory: true,
        isActive: true,
      },
    });

    const stockLevels = await Promise.all(
      products.map(async (product) => {
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
      })
    );

    return stockLevels;
  }

  async getLowStockProducts(threshold = 10) {
    const stockLevels = await this.getStockLevels(threshold);
    return stockLevels.filter((level) => level.isLowStock);
  }
}
