import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SupplierService } from '../services/supplier.service';
import { CreateSupplierDto, UpdateSupplierDto } from '../dto/supplier.dto';
import { Supplier } from '../entities/supplier.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({ status: 201, description: 'The supplier has been successfully created.', type: Supplier })
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({ status: 200, description: 'Return all suppliers.', type: [Supplier] })
  findAll() {
    return this.supplierService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a supplier by id' })
  @ApiResponse({ status: 200, description: 'Return the supplier.', type: Supplier })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a supplier' })
  @ApiResponse({ status: 200, description: 'The supplier has been successfully updated.', type: Supplier })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.supplierService.update(+id, updateSupplierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a supplier' })
  @ApiResponse({ status: 200, description: 'The supplier has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  remove(@Param('id') id: string) {
    return this.supplierService.remove(+id);
  }
}
