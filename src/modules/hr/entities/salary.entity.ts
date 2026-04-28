import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';

export enum SalaryStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  FAILED = 'Failed',
}

@Entity()
export class Salary {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  employee: Employee;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  month: number; // 1-12

  @Column()
  year: number;

  @Column({
    type: 'enum',
    enum: SalaryStatus,
    default: SalaryStatus.PENDING,
  })
  status: SalaryStatus;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
