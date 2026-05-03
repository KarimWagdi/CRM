import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SalaryService } from '../services/salary.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('salaries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('salaries')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Get()
  @Roles('Admin', 'Finance', 'HR')
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
