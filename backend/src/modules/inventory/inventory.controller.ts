import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto, UpdateInventoryItemDto, PurchaseInventoryDto } from './dto/inventory.dto';
import { InventoryItem } from './entities/inventory-item.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get inventory statistics' })
  getStats() {
    return this.inventoryService.getStats();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new inventory item' })
  @ApiResponse({ status: 201, type: InventoryItem })
  create(@Body() createDto: CreateInventoryItemDto) {
    return this.inventoryService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory items' })
  @ApiResponse({ status: 200, type: [InventoryItem] })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an inventory item by id' })
  @ApiResponse({ status: 200, type: InventoryItem })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an inventory item' })
  @ApiResponse({ status: 200, type: InventoryItem })
  update(@Param('id') id: string, @Body() updateDto: UpdateInventoryItemDto) {
    return this.inventoryService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an inventory item' })
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }

  @Post(':id/purchase')
  @ApiOperation({ summary: 'Purchase more units of an inventory item' })
  @ApiResponse({ status: 200, type: InventoryItem })
  purchase(@Param('id') id: string, @Body() purchaseDto: PurchaseInventoryDto) {
    return this.inventoryService.purchase(+id, purchaseDto);
  }
}
