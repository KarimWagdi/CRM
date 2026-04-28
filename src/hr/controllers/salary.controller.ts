import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SalaryService } from '../services/salary.service';

@ApiTags('salaries')
@Controller('salaries')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all salary records' })
  findAll() {
    return this.salaryService.findAll();
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get salary records for an employee' })
  findByEmployee(@Param('employeeId') employeeId: number) {
    return this.salaryService.findByEmployee(employeeId);
  }

  @Post('trigger-monthly')
  @ApiOperation({ summary: 'Manually trigger monthly salary generation' })
  triggerMonthly() {
    return this.salaryService.handleMonthlySalaryGeneration();
  }
}
