import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from '../dto/payment.dto';
import { Invoice } from '../entities/invoice.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({ relations: ['invoice'] });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['invoice'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment record with ID ${id} not found`);
    }
    return payment;
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { invoiceId, ...paymentData } = createPaymentDto;
    const invoice = await this.invoiceRepository.findOneBy({ id: invoiceId });
    if (!invoice) throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);

    const payment = this.paymentRepository.create({
      ...paymentData,
      invoice,
    });
    return this.paymentRepository.save(payment);
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    const { invoiceId, ...paymentData } = updatePaymentDto;

    if (invoiceId) {
      const invoice = await this.invoiceRepository.findOneBy({ id: invoiceId });
      if (!invoice) throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
      payment.invoice = invoice;
    }

    this.paymentRepository.merge(payment, paymentData);
    return this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.paymentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment record with ID ${id} not found`);
    }
  }
}
