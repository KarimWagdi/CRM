import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { OpportunityStage } from '../entities/opportunity.entity';

export class CreateOpportunityDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ enum: OpportunityStage, default: OpportunityStage.PROSPECTING })
  @IsEnum(OpportunityStage)
  @IsOptional()
  stage?: OpportunityStage;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  closeDate?: Date;

  @ApiProperty()
  @IsNumber()
  accountId: number;
}

export class UpdateOpportunityDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ enum: OpportunityStage, required: false })
  @IsEnum(OpportunityStage)
  @IsOptional()
  stage?: OpportunityStage;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  closeDate?: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  accountId?: number;
}
