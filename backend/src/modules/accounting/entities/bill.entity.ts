import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Supplier } from './supplier.entity';
import { BillItem } from './bill-item.entity';

export enum BillStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
  CANCELLED = 'Cancelled',
}

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  billNumber: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({
    type: 'simple-enum',
    enum: BillStatus,
    default: BillStatus.PENDING,
  })
  status: BillStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.bills)
  supplier: Supplier;

  @OneToMany(() => BillItem, (item) => item.bill, { cascade: true })
  items: BillItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
