import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeaveRequestService } from '../services/leave-request.service';
import { CreateLeaveRequestDto, UpdateLeaveRequestDto } from '../dto/leave-request.dto';
import { LeaveRequest } from '../entities/leave-request.entity';

@ApiTags('leave-requests')
@Controller('leave-requests')
export class LeaveRequestController {
  constructor(private readonly leaveRequestService: LeaveRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new leave request' })
  @ApiResponse({ status: 201, description: 'The leave request has been successfully created.', type: LeaveRequest })
  create(@Body() createLeaveRequestDto: CreateLeaveRequestDto) {
    return this.leaveRequestService.create(createLeaveRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leave requests' })
  @ApiResponse({ status: 200, description: 'Return all leave requests.', type: [LeaveRequest] })
  findAll() {
    return this.leaveRequestService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a leave request by id' })
  @ApiResponse({ status: 200, description: 'Return the leave request.', type: LeaveRequest })
  @ApiResponse({ status: 404, description: 'Leave request not found.' })
  findOne(@Param('id') id: string) {
    return this.leaveRequestService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a leave request' })
  @ApiResponse({ status: 200, description: 'The leave request has been successfully updated.', type: LeaveRequest })
  @ApiResponse({ status: 404, description: 'Leave request not found.' })
  update(@Param('id') id: string, @Body() updateLeaveRequestDto: UpdateLeaveRequestDto) {
    return this.leaveRequestService.update(+id, updateLeaveRequestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a leave request' })
  @ApiResponse({ status: 200, description: 'The leave request has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Leave request not found.' })
  remove(@Param('id') id: string) {
    return this.leaveRequestService.remove(+id);
  }
}
