import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryLogDto } from './dto/create-inventory-log.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('logs')
  @ApiOperation({ summary: 'Create inventory log entry' })
  createLog(@Body() createLogDto: CreateInventoryLogDto) {
    return this.inventoryService.createLog(createLogDto);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get inventory logs' })
  findAll(
    @Query('productId') productId?: string,
    @Query('action') action?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.inventoryService.findAll(
      productId,
      action as any,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50
    );
  }

  @Get('stock/:productId')
  @ApiOperation({ summary: 'Get current stock for a product' })
  getCurrentStock(@Param('productId') productId: string) {
    return this.inventoryService.getCurrentStock(productId);
  }

  @Get('stock-levels')
  @ApiOperation({ summary: 'Get stock levels for all products' })
  getStockLevels(@Query('threshold') threshold?: string) {
    return this.inventoryService.getStockLevels(
      threshold ? parseInt(threshold) : 10
    );
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock' })
  getLowStockProducts(@Query('threshold') threshold?: string) {
    return this.inventoryService.getLowStockProducts(
      threshold ? parseInt(threshold) : 10
    );
  }
}
