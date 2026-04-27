import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeadService } from '../services/lead.service';
import { CreateLeadDto, UpdateLeadDto } from '../dto/lead.dto';
import { Lead } from '../entities/lead.entity';

@ApiTags('leads')
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiResponse({ status: 201, description: 'The lead has been successfully created.', type: Lead })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadService.create(createLeadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads' })
  @ApiResponse({ status: 200, description: 'Return all leads.', type: [Lead] })
  findAll() {
    return this.leadService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lead by id' })
  @ApiResponse({ status: 200, description: 'Return the lead.', type: Lead })
  @ApiResponse({ status: 404, description: 'Lead not found.' })
  findOne(@Param('id') id: string) {
    return this.leadService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lead' })
  @ApiResponse({ status: 200, description: 'The lead has been successfully updated.', type: Lead })
  @ApiResponse({ status: 404, description: 'Lead not found.' })
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadService.update(+id, updateLeadDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lead' })
  @ApiResponse({ status: 200, description: 'The lead has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Lead not found.' })
  remove(@Param('id') id: string) {
    return this.leadService.remove(+id);
  }
}
