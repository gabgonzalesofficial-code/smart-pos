import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales-summary')
  @ApiOperation({ summary: 'Get sales summary' })
  getSalesSummary(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string
  ) {
    return this.reportsService.getSalesSummary(dateFrom, dateTo);
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Get top selling products' })
  getTopProducts(
    @Query('limit') limit?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string
  ) {
    return this.reportsService.getTopProducts(
      limit ? parseInt(limit) : 10,
      dateFrom,
      dateTo
    );
  }

  @Get('sales-by-hour')
  @ApiOperation({ summary: 'Get sales by hour' })
  getSalesByHour(@Query('date') date?: string) {
    return this.reportsService.getSalesByHour(date);
  }
}
