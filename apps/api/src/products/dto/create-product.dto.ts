import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: '1000000001' })
  @IsString()
  barcode: string;

  @ApiProperty({ example: 'Coca Cola 500ml' })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 25.0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ required: false, example: 15.0 })
  @IsNumber()
  @IsOptional()
  cost?: number;

  @ApiProperty({ required: false, example: 'Beverages' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  trackInventory?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  supplierId?: string;
}
