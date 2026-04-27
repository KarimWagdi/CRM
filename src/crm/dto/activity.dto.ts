import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { ActivityType } from '../entities/activity.entity';

export class CreateActivityDto {
  @ApiProperty({ enum: ActivityType, default: ActivityType.TASK })
  @IsEnum(ActivityType)
  @IsOptional()
  type?: ActivityType;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  contactId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  opportunityId?: number;
}

export class UpdateActivityDto {
  @ApiProperty({ enum: ActivityType, required: false })
  @IsEnum(ActivityType)
  @IsOptional()
  type?: ActivityType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  contactId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  opportunityId?: number;
}
