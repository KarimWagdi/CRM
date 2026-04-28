import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsDateString()
  paymentDate: Date;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  paymentMethod: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty()
  @IsNumber()
  invoiceId: number;
}

export class UpdatePaymentDto {
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  paymentDate?: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  invoiceId?: number;
}
