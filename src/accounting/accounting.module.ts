import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Payment } from './entities/payment.entity';
import { Expense } from './entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceItem, Payment, Expense])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class AccountingModule {}
