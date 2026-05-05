import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BillService } from '../services/bill.service';
import { CreateBillDto, UpdateBillDto } from '../dto/bill.dto';
import { Bill } from '../entities/bill.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('bills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bills')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get bill statistics' })
  getStats() {
    return this.billService.getStats();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new bill' })
  @ApiResponse({ status: 201, description: 'The bill has been successfully created.', type: Bill })
  create(@Body() createBillDto: CreateBillDto) {
    return this.billService.create(createBillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bills' })
  @ApiResponse({ status: 200, description: 'Return all bills.', type: [Bill] })
  findAll() {
    return this.billService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bill by id' })
  @ApiResponse({ status: 200, description: 'Return the bill.', type: Bill })
  @ApiResponse({ status: 404, description: 'Bill not found.' })
  findOne(@Param('id') id: string) {
    return this.billService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bill' })
  @ApiResponse({ status: 200, description: 'The bill has been successfully updated.', type: Bill })
  @ApiResponse({ status: 404, description: 'Bill not found.' })
  update(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
    return this.billService.update(+id, updateBillDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bill' })
  @ApiResponse({ status: 200, description: 'The bill has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Bill not found.' })
  remove(@Param('id') id: string) {
    return this.billService.remove(+id);
  }
}
