import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceItem } from '../entities/invoice-item.entity';
import { CreateInvoiceItemDto, UpdateInvoiceItemDto } from '../dto/invoice-item.dto';
import { Invoice } from '../entities/invoice.entity';

@Injectable()
export class InvoiceItemService {
  constructor(
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  findAll(): Promise<InvoiceItem[]> {
    return this.invoiceItemRepository.find({ relations: ['invoice'] });
  }

  async findOne(id: number): Promise<InvoiceItem> {
    const invoiceItem = await this.invoiceItemRepository.findOne({
      where: { id },
      relations: ['invoice'],
    });
    if (!invoiceItem) {
      throw new NotFoundException(`Invoice item with ID ${id} not found`);
    }
    return invoiceItem;
  }

  async create(createInvoiceItemDto: CreateInvoiceItemDto): Promise<InvoiceItem> {
    const { invoiceId, ...itemData } = createInvoiceItemDto;
    const invoice = await this.invoiceRepository.findOneBy({ id: invoiceId });
    if (!invoice) throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);

    const invoiceItem = this.invoiceItemRepository.create({
      ...itemData,
      invoice,
    });
    return this.invoiceItemRepository.save(invoiceItem);
  }

  async update(id: number, updateInvoiceItemDto: UpdateInvoiceItemDto): Promise<InvoiceItem> {
    const invoiceItem = await this.findOne(id);
    const { invoiceId, ...itemData } = updateInvoiceItemDto;

    if (invoiceId) {
      const invoice = await this.invoiceRepository.findOneBy({ id: invoiceId });
      if (!invoice) throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
      invoiceItem.invoice = invoice;
    }

    this.invoiceItemRepository.merge(invoiceItem, itemData);
    return this.invoiceItemRepository.save(invoiceItem);
  }

  async remove(id: number): Promise<void> {
    const result = await this.invoiceItemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Invoice item with ID ${id} not found`);
    }
  }
}
