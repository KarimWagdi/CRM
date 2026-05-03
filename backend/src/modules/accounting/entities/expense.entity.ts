import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Employee } from '../../hr/entities/employee.entity';

export enum ExpenseStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REIMBURSED = 'Reimbursed',
  REJECTED = 'Rejected',
}

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  expenseDate: Date;

  @Column()
  category: string;

  @Column({
    type: 'simple-enum',
    enum: ExpenseStatus,
    default: ExpenseStatus.PENDING,
  })
  status: ExpenseStatus;

  @ManyToOne(() => Employee, (employee) => employee.expenses)
  employee: Employee;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
