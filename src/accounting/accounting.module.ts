import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Payment } from './entities/payment.entity';
import { Expense } from './entities/expense.entity';
import { Account } from '../crm/entities/account.entity';
import { Employee } from '../hr/entities/employee.entity';
import { InvoiceService } from './services/invoice.service';
import { InvoiceItemService } from './services/invoice-item.service';
import { PaymentService } from './services/payment.service';
import { ExpenseService } from './services/expense.service';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceItemController } from './controllers/invoice-item.controller';
import { PaymentController } from './controllers/payment.controller';
import { ExpenseController } from './controllers/expense.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      InvoiceItem,
      Payment,
      Expense,
      Account,
      Employee,
    ]),
  ],
  controllers: [
    InvoiceController,
    InvoiceItemController,
    PaymentController,
    ExpenseController,
  ],
  providers: [
    InvoiceService,
    InvoiceItemService,
    PaymentService,
    ExpenseService,
  ],
})
export class AccountingModule {}
