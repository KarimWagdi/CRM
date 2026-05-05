import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BillStatus } from '../entities/bill.entity';

export class CreateBillItemDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;
}

export class CreateBillDto {
  @ApiProperty()
  @IsString()
  billNumber: string;

  @ApiProperty()
  @IsDateString()
  issueDate: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ enum: BillStatus, default: BillStatus.PENDING })
  @IsEnum(BillStatus)
  @IsOptional()
  status?: BillStatus;

  @ApiProperty()
  @IsNumber()
  supplierId: number;

  @ApiProperty({ type: [CreateBillItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBillItemDto)
  items: CreateBillItemDto[];
}

export class UpdateBillDto extends PartialType(CreateBillDto) {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;
}
