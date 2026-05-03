import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OpportunityService } from '../services/opportunity.service';
import { CreateOpportunityDto, UpdateOpportunityDto } from '../dto/opportunity.dto';
import { Opportunity } from '../entities/opportunity.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('opportunities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('opportunities')
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get opportunity statistics' })
  getStats() {
    return this.opportunityService.getStats();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new opportunity' })
  @ApiResponse({ status: 201, description: 'The opportunity has been successfully created.', type: Opportunity })
  create(@Body() createOpportunityDto: CreateOpportunityDto) {
    return this.opportunityService.create(createOpportunityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all opportunities' })
  @ApiResponse({ status: 200, description: 'Return all opportunities.', type: [Opportunity] })
  findAll() {
    return this.opportunityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an opportunity by id' })
  @ApiResponse({ status: 200, description: 'Return the opportunity.', type: Opportunity })
  @ApiResponse({ status: 404, description: 'Opportunity not found.' })
  findOne(@Param('id') id: string) {
    return this.opportunityService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an opportunity' })
  @ApiResponse({ status: 200, description: 'The opportunity has been successfully updated.', type: Opportunity })
  @ApiResponse({ status: 404, description: 'Opportunity not found.' })
  update(@Param('id') id: string, @Body() updateOpportunityDto: UpdateOpportunityDto) {
    return this.opportunityService.update(+id, updateOpportunityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an opportunity' })
  @ApiResponse({ status: 200, description: 'The opportunity has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Opportunity not found.' })
  remove(@Param('id') id: string) {
    return this.opportunityService.remove(+id);
  }
}
