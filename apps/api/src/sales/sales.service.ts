import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@pos/prisma';
import { CreateSaleDto, PaymentMethod, SaleStatus, InventoryAction } from '@pos/shared';
import { ProductsService } from '../products/products.service';
import { InventoryService } from '../inventory/inventory.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SalesService {
  constructor(
    private productsService: ProductsService,
    private inventoryService: InventoryService
  ) {}

  async create(createSaleDto: CreateSaleDto, cashierId: string) {
    // Generate receipt number
    const receiptNumber = this.generateReceiptNumber();

    // Validate products and stock
    for (const item of createSaleDto.items) {
      const product = await this.productsService.findOne(item.productId);
      
      if (!product.isActive) {
        throw new BadRequestException(`Product ${product.name} is not active`);
      }

      if (product.trackInventory) {
        const stock = await this.inventoryService.getCurrentStock(item.productId);
        if (stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}. Available: ${stock}, Requested: ${item.quantity}`
          );
        }
      }
    }

    // Create sale with items
    const sale = await prisma.sale.create({
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
        status: SaleStatus.COMPLETED,
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

    // Update inventory for each item
    for (const item of createSaleDto.items) {
      const product = await this.productsService.findOne(item.productId);
      if (product.trackInventory) {
        await this.inventoryService.createLog({
          productId: item.productId,
          quantity: -item.quantity,
          action: InventoryAction.SALE,
          reference: receiptNumber,
          notes: `Sale: ${receiptNumber}`,
        });
      }
    }

    return sale;
  }

  async findAll(page = 1, limit = 50, dateFrom?: string, dateTo?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      prisma.sale.findMany({
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
      prisma.sale.count({ where }),
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

  async findOne(id: string) {
    return prisma.sale.findUnique({
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

  async findByReceiptNumber(receiptNumber: string) {
    return prisma.sale.findUnique({
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

  async refund(id: string, reason?: string) {
    const sale = await this.findOne(id);
    
    if (sale.status === SaleStatus.REFUNDED) {
      throw new BadRequestException('Sale already refunded');
    }

    if (sale.status === SaleStatus.CANCELLED) {
      throw new BadRequestException('Cannot refund a cancelled sale');
    }

    // Refund sale
    const refundedSale = await prisma.sale.update({
      where: { id },
      data: {
        status: SaleStatus.REFUNDED,
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

    // Restore inventory
    for (const item of sale.items) {
      const product = await this.productsService.findOne(item.productId);
      if (product.trackInventory) {
        await this.inventoryService.createLog({
          productId: item.productId,
          quantity: item.quantity,
          action: InventoryAction.RETURN,
          reference: sale.receiptNumber,
          notes: `Refund: ${sale.receiptNumber}`,
        });
      }
    }

    return refundedSale;
  }

  private generateReceiptNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `RCP-${dateStr}-${randomStr}`;
  }
}
