import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from '../services/attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto } from '../dto/attendance.dto';
import { Attendance } from '../entities/attendance.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get attendance statistics' })
  getStats() {
    return this.attendanceService.getStats();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new attendance record' })
  @ApiResponse({ status: 201, description: 'The attendance record has been successfully created.', type: Attendance })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiResponse({ status: 200, description: 'Return all attendance records.', type: [Attendance] })
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an attendance record by id' })
  @ApiResponse({ status: 200, description: 'Return the attendance record.', type: Attendance })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attendance record' })
  @ApiResponse({ status: 200, description: 'The attendance record has been successfully updated.', type: Attendance })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(+id, updateAttendanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendance record' })
  @ApiResponse({ status: 200, description: 'The attendance record has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }
}
