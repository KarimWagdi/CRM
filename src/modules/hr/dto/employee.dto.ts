import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsDateString, IsNumber } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  hireDate?: Date;

  @ApiProperty()
  @IsNumber()
  departmentId: number;

  @ApiProperty()
  @IsNumber()
  positionId: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  userId?: number;
}

export class UpdateEmployeeDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  hireDate?: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  departmentId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  positionId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  userId?: number;
}
