import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance.entity';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsNumber()
  employeeId: number;

  @ApiProperty()
  @IsDateString()
  date: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  checkIn?: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  checkOut?: Date;

  @ApiProperty({ enum: AttendanceStatus, default: AttendanceStatus.PRESENT })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;
}

export class UpdateAttendanceDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  employeeId?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  date?: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  checkIn?: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  checkOut?: Date;

  @ApiProperty({ enum: AttendanceStatus, required: false })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;
}
