import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class PerformanceReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  employee: Employee;

  @ManyToOne(() => Employee)
  reviewer: Employee;

  @Column()
  reviewDate: Date;

  @Column()
  period: string; // e.g., "Q1 2024" or "January 2024"

  @Column({ type: 'int' })
  score: number; // e.g., 1-5

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'json', nullable: true })
  metrics: any; // Dynamic metrics like { tasksCompleted: 10, attendanceRate: 0.95 }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
