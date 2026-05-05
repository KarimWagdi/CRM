import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { CreateInventoryItemDto, UpdateInventoryItemDto, PurchaseInventoryDto } from './dto/inventory.dto';
import { BillService } from '../accounting/services/bill.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
    private billService: BillService,
  ) {}

  findAll(): Promise<InventoryItem[]> {
    return this.inventoryRepository.find();
  }

  async findOne(id: number): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return item;
  }

  create(createDto: CreateInventoryItemDto): Promise<InventoryItem> {
    const item = this.inventoryRepository.create(createDto);
    return this.inventoryRepository.save(item);
  }

  async update(id: number, updateDto: UpdateInventoryItemDto): Promise<InventoryItem> {
    const item = await this.findOne(id);
    this.inventoryRepository.merge(item, updateDto);
    return this.inventoryRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const result = await this.inventoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
  }

  async purchase(id: number, purchaseDto: PurchaseInventoryDto): Promise<InventoryItem> {
    const item = await this.findOne(id);
    const { supplierId, quantity, unitPrice } = purchaseDto;

    const purchasePrice = unitPrice || item.unitPrice;

    // Create Bill in Accounting
    await this.billService.create({
      billNumber: `BILL-INV-${Date.now()}`,
      issueDate: new Date(),
      supplierId,
      items: [
        {
          description: `Purchase of ${item.name} (${quantity} units)`,
          quantity,
          unitPrice: purchasePrice,
        },
      ],
    });

    // Update stock
    item.quantity = Number(item.quantity) + Number(quantity);
    if (unitPrice) {
      item.unitPrice = unitPrice;
    }

    return this.inventoryRepository.save(item);
  }

  async getNearEmpty(): Promise<InventoryItem[]> {
    const allItems = await this.findAll();
    return allItems.filter(item => Number(item.quantity) <= Number(item.minQuantity));
  }

  async getStats() {
      const allItems = await this.findAll();
      const nearEmpty = allItems.filter(item => Number(item.quantity) <= Number(item.minQuantity));
      const totalValue = allItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);

      return {
          totalItems: allItems.length,
          nearEmptyCount: nearEmpty.length,
          totalValue,
          nearEmptyItems: nearEmpty
      };
  }
}
