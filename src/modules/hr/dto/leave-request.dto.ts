import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsDateString, IsOptional, IsString, IsNumber } from 'class-validator';
import { LeaveType, LeaveStatus } from '../entities/leave-request.entity';

export class CreateLeaveRequestDto {
  @ApiProperty()
  @IsNumber()
  employeeId: number;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;

  @ApiProperty({ enum: LeaveType, default: LeaveType.PERSONAL })
  @IsEnum(LeaveType)
  @IsOptional()
  type?: LeaveType;

  @ApiProperty({ enum: LeaveStatus, default: LeaveStatus.PENDING })
  @IsEnum(LeaveStatus)
  @IsOptional()
  status?: LeaveStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class UpdateLeaveRequestDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  employeeId?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ enum: LeaveType, required: false })
  @IsEnum(LeaveType)
  @IsOptional()
  type?: LeaveType;

  @ApiProperty({ enum: LeaveStatus, required: false })
  @IsEnum(LeaveStatus)
  @IsOptional()
  status?: LeaveStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
