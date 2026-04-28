import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { InvoiceStatus } from '../entities/invoice.entity';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsString()
  invoiceNumber: string;

  @ApiProperty()
  @IsDateString()
  issueDate: Date;

  @ApiProperty()
  @IsDateString()
  dueDate: Date;

  @ApiProperty({ enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @ApiProperty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty()
  @IsNumber()
  accountId: number;
}

export class UpdateInvoiceDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  issueDate?: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ enum: InvoiceStatus, required: false })
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  accountId?: number;
}
