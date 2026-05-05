import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { List } from './list.entity';
import { Employee } from '../../hr/entities/employee.entity';
import { TaskHistory } from './task-history.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  position: number;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @ManyToOne(() => List, (list) => list.tasks)
  list: List;

  @ManyToOne(() => Employee, (employee) => employee.tasks, { nullable: true })
  assignee: Employee;

  @OneToMany(() => TaskHistory, (history) => history.task)
  history: TaskHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
