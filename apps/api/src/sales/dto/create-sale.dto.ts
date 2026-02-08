import { IsArray, IsNumber, IsEnum, IsOptional, IsString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@pos/shared';

class SaleItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @Min(0)
  discount: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  total: number;
}

export class CreateSaleDto {
  @ApiProperty({ type: [SaleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @ApiProperty()
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @Min(0)
  discount: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @Min(0)
  tax: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amountPaid: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @Min(0)
  change: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
