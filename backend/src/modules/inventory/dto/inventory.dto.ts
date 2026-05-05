import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateInventoryItemDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  minQuantity?: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;
}

export class UpdateInventoryItemDto extends PartialType(CreateInventoryItemDto) {}

export class PurchaseInventoryDto {
  @ApiProperty()
  @IsNumber()
  supplierId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  unitPrice?: number;
}
