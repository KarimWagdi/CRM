import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvoiceItemService } from '../services/invoice-item.service';
import { CreateInvoiceItemDto, UpdateInvoiceItemDto } from '../dto/invoice-item.dto';
import { InvoiceItem } from '../entities/invoice-item.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('invoice-items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoice-items')
export class InvoiceItemController {
  constructor(private readonly invoiceItemService: InvoiceItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice item' })
  @ApiResponse({ status: 201, description: 'The invoice item has been successfully created.', type: InvoiceItem })
  create(@Body() createInvoiceItemDto: CreateInvoiceItemDto) {
    return this.invoiceItemService.create(createInvoiceItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoice items' })
  @ApiResponse({ status: 200, description: 'Return all invoice items.', type: [InvoiceItem] })
  findAll() {
    return this.invoiceItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an invoice item by id' })
  @ApiResponse({ status: 200, description: 'Return the invoice item.', type: InvoiceItem })
  @ApiResponse({ status: 404, description: 'Invoice item not found.' })
  findOne(@Param('id') id: string) {
    return this.invoiceItemService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an invoice item' })
  @ApiResponse({ status: 200, description: 'The invoice item has been successfully updated.', type: InvoiceItem })
  @ApiResponse({ status: 404, description: 'Invoice item not found.' })
  update(@Param('id') id: string, @Body() updateInvoiceItemDto: UpdateInvoiceItemDto) {
    return this.invoiceItemService.update(+id, updateInvoiceItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an invoice item' })
  @ApiResponse({ status: 200, description: 'The invoice item has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Invoice item not found.' })
  remove(@Param('id') id: string) {
    return this.invoiceItemService.remove(+id);
  }
}
