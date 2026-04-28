import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PerformanceService } from '../services/performance.service';
import { CreatePerformanceReviewDto } from '../dto/performance-review.dto';

@ApiTags('performance')
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all performance reviews' })
  findAll() {
    return this.performanceService.findAll();
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get performance reviews for an employee' })
  findByEmployee(@Param('employeeId') employeeId: number) {
    return this.performanceService.findByEmployee(employeeId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new performance review' })
  create(@Body() createDto: CreatePerformanceReviewDto) {
    return this.performanceService.create(createDto);
  }

  @Get('calculate-metrics/:employeeId')
  @ApiOperation({ summary: 'Calculate metrics for an employee' })
  calculateMetrics(
    @Param('employeeId') employeeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.performanceService.calculateMetrics(
      employeeId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
