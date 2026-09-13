import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiScoringService } from '../services/ai-scoring.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('crm-ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('crm/ai')
export class AiScoringController {
  constructor(private readonly aiScoringService: AiScoringService) {}

  @Get('score-lead/:id')
  @ApiOperation({ summary: 'Calculate AI predictive score for a lead' })
  scoreLead(@Param('id') id: string) {
    return this.aiScoringService.scoreLead(+id);
  }

  @Get('batch-score')
  @ApiOperation({ summary: 'Batch score all leads ordered by predictive score' })
  batchScore() {
    return this.aiScoringService.batchScoreLeads();
  }
}
