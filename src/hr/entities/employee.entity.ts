import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Department } from './department.entity';
import { Position } from './position.entity';
import { LeaveRequest } from './leave-request.entity';
import { Attendance } from './attendance.entity';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Expense } from '../../accounting/entities/expense.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  hireDate: Date;

  @ManyToOne(() => Department, (department) => department.employees)
  department: Department;

  @ManyToOne(() => Position, (position) => position.employees)
  position: Position;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  user: User;

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee)
  leaveRequests: LeaveRequest[];

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendances: Attendance[];

  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];

  @OneToMany(() => Expense, (expense) => expense.employee)
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
