import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ExpenseStatus } from '../entities/expense.entity';

export class CreateExpenseDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsDateString()
  expenseDate: Date;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty({ enum: ExpenseStatus, default: ExpenseStatus.PENDING })
  @IsEnum(ExpenseStatus)
  @IsOptional()
  status?: ExpenseStatus;

  @ApiProperty()
  @IsNumber()
  employeeId: number;
}

export class UpdateExpenseDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  expenseDate?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ enum: ExpenseStatus, required: false })
  @IsEnum(ExpenseStatus)
  @IsOptional()
  status?: ExpenseStatus;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  employeeId?: number;
}
