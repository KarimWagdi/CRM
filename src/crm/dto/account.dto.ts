import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsPhoneNumber, IsUrl } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ required: false })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateAccountDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ required: false })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;
}
