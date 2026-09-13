import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from '../services/audit.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('Admin')
  @ApiOperation({ summary: 'Get recent system audit logs' })
  findAll(@Query('limit') limit?: number) {
    return this.auditService.findAll(limit ? +limit : 100);
  }

  @Get(':entityName/:entityId')
  @Roles('Admin')
  @ApiOperation({ summary: 'Get audit logs for a specific entity' })
  findByEntity(
    @Param('entityName') entityName: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditService.findByEntity(entityName, entityId);
  }
}
