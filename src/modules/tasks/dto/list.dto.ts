import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateListDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiProperty()
  @IsNumber()
  boardId: number;
}

export class UpdateListDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  boardId?: number;
}
