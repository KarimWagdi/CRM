import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ActivityService } from '../services/activity.service';
import { CreateActivityDto, UpdateActivityDto } from '../dto/activity.dto';
import { Activity } from '../entities/activity.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiResponse({ status: 201, description: 'The activity has been successfully created.', type: Activity })
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  @ApiResponse({ status: 200, description: 'Return all activities.', type: [Activity] })
  findAll() {
    return this.activityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an activity by id' })
  @ApiResponse({ status: 200, description: 'Return the activity.', type: Activity })
  @ApiResponse({ status: 404, description: 'Activity not found.' })
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an activity' })
  @ApiResponse({ status: 200, description: 'The activity has been successfully updated.', type: Activity })
  @ApiResponse({ status: 404, description: 'Activity not found.' })
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activityService.update(+id, updateActivityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiResponse({ status: 200, description: 'The activity has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Activity not found.' })
  remove(@Param('id') id: string) {
    return this.activityService.remove(+id);
  }
}
