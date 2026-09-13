import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne } from 'typeorm';
import { Role } from './role.entity';
import { Employee } from '../../hr/entities/employee.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToOne(() => Employee, (employee) => employee.user)
  employee: Employee;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
