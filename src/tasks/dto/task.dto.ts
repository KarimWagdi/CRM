import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty()
  @IsNumber()
  listId: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  assigneeId?: number;
}

export class UpdateTaskDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  listId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  assigneeId?: number;
}
