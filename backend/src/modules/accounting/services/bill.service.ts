import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { BillItem } from '../entities/bill-item.entity';
import { Supplier } from '../entities/supplier.entity';
import { CreateBillDto, UpdateBillDto } from '../dto/bill.dto';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  findAll(): Promise<Bill[]> {
    return this.billRepository.find({ relations: ['supplier'] });
  }

  async findOne(id: number): Promise<Bill> {
    const bill = await this.billRepository.findOne({
      where: { id },
      relations: ['supplier', 'items'],
    });
    if (!bill) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }
    return bill;
  }

  async create(createBillDto: CreateBillDto): Promise<Bill> {
    const { supplierId, items, ...billData } = createBillDto;
    const supplier = await this.supplierRepository.findOneBy({ id: supplierId });
    if (!supplier) throw new NotFoundException(`Supplier with ID ${supplierId} not found`);

    let totalAmount = 0;
    const billItems = items.map((item) => {
      const amount = item.quantity * item.unitPrice;
      totalAmount += amount;
      return {
        ...item,
        amount,
      };
    });

    const bill = this.billRepository.create({
      ...billData,
      totalAmount,
      supplier,
      items: billItems,
    });

    return this.billRepository.save(bill);
  }

  async update(id: number, updateBillDto: UpdateBillDto): Promise<Bill> {
    const bill = await this.findOne(id);
    const { supplierId, items, ...billData } = updateBillDto;

    if (supplierId) {
      const supplier = await this.supplierRepository.findOneBy({ id: supplierId });
      if (!supplier) throw new NotFoundException(`Supplier with ID ${supplierId} not found`);
      bill.supplier = supplier;
    }

    if (items) {
      let totalAmount = 0;
      const billItems = items.map((item) => {
        const amount = item.quantity * item.unitPrice;
        totalAmount += amount;
        return {
          ...item,
          amount,
        };
      });
      bill.items = billItems as BillItem[];
      bill.totalAmount = totalAmount;
    }

    this.billRepository.merge(bill, billData);
    return this.billRepository.save(bill);
  }

  async remove(id: number): Promise<void> {
    const result = await this.billRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }
  }

  async getStats() {
    const totalCount = await this.billRepository.count();
    const totalAmount = await this.billRepository
      .createQueryBuilder('bill')
      .select('SUM(bill.totalAmount)', 'total')
      .getRawOne();

    const statusCounts = await this.billRepository
      .createQueryBuilder('bill')
      .select('bill.status', 'status')
      .addSelect('COUNT(bill.id)', 'count')
      .groupBy('bill.status')
      .getRawMany();

    return {
      totalCount,
      totalAmount: parseFloat(totalAmount.total || 0),
      statusCounts,
    };
  }
}
