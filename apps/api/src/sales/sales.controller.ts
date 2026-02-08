import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('sales')
@ApiBearerAuth()
@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale' })
  create(@Body() createSaleDto: CreateSaleDto, @CurrentUser() user: any) {
    return this.salesService.create(createSaleDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sales with pagination' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string
  ) {
    return this.salesService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
      dateFrom,
      dateTo
    );
  }

  @Get('receipt/:receiptNumber')
  @ApiOperation({ summary: 'Find sale by receipt number' })
  findByReceiptNumber(@Param('receiptNumber') receiptNumber: string) {
    return this.salesService.findByReceiptNumber(receiptNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sale by ID' })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Refund a sale' })
  refund(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.salesService.refund(id, reason);
  }
}
