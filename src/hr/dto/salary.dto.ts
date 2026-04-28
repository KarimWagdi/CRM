import { IsNumber, IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SalaryStatus } from '../entities/salary.entity';

export class CreateSalaryDto {
  @ApiProperty()
  @IsNumber()
  employeeId: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  month: number;

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiProperty({ enum: SalaryStatus, default: SalaryStatus.PENDING })
  @IsEnum(SalaryStatus)
  @IsOptional()
  status?: SalaryStatus;
}
