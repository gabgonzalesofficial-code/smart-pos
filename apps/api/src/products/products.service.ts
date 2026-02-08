import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@pos/prisma';
import { CreateProductDto, UpdateProductDto } from '@pos/shared';

@Injectable()
export class ProductsService {
  async findAll(search?: string, category?: string) {
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.category = category;
    }

    return prisma.product.findMany({
      where,
      include: {
        supplier: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        supplier: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findByBarcode(barcode: string) {
    return prisma.product.findUnique({
      where: { barcode },
      include: {
        supplier: true,
      },
    });
  }

  async create(createProductDto: CreateProductDto) {
    return prisma.product.create({
      data: createProductDto,
      include: {
        supplier: true,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        supplier: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getCategories() {
    const products = await prisma.product.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    });
    return products.map((p) => p.category).filter(Boolean);
  }
}
