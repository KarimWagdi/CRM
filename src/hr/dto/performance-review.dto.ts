import { IsNumber, IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePerformanceReviewDto {
  @ApiProperty()
  @IsNumber()
  employeeId: number;

  @ApiProperty()
  @IsNumber()
  reviewerId: number;

  @ApiProperty()
  @IsString()
  period: string;

  @ApiProperty()
  @IsNumber()
  score: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  metrics?: any;
}
