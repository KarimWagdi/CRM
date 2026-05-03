import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../dto/invoice.dto';
import { Account } from '../../crm/entities/account.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find({ relations: ['account'] });
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['account', 'items', 'payments'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const { accountId, ...invoiceData } = createInvoiceDto;
    const account = await this.accountRepository.findOneBy({ id: accountId });
    if (!account) throw new NotFoundException(`Account with ID ${accountId} not found`);

    const invoice = this.invoiceRepository.create({
      ...invoiceData,
      account,
    });
    return this.invoiceRepository.save(invoice);
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);
    const { accountId, ...invoiceData } = updateInvoiceDto;

    if (accountId) {
      const account = await this.accountRepository.findOneBy({ id: accountId });
      if (!account) throw new NotFoundException(`Account with ID ${accountId} not found`);
      invoice.account = account;
    }

    this.invoiceRepository.merge(invoice, invoiceData);
    return this.invoiceRepository.save(invoice);
  }

  async remove(id: number): Promise<void> {
    const result = await this.invoiceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
  }

  async getStats() {
    const totalCount = await this.invoiceRepository.count();
    const totalAmount = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.totalAmount)', 'total')
      .getRawOne();

    const statusCounts = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('invoice.status', 'status')
      .addSelect('COUNT(invoice.id)', 'count')
      .groupBy('invoice.status')
      .getRawMany();

    const recentInvoices = await this.invoiceRepository.find({
      relations: ['account'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalCount,
      totalAmount: parseFloat(totalAmount.total || 0),
      statusCounts,
      recentInvoices,
    };
  }
}
