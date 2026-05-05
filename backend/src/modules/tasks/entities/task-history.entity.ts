import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../../users/entities/user.entity';

export enum TaskAction {
  ASSIGNED = 'ASSIGNED',
  STATUS_CHANGE = 'STATUS_CHANGE',
}

@Entity()
export class TaskHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.history, { onDelete: 'CASCADE' })
  task: Task;

  @Column({
    type: 'simple-enum',
    enum: TaskAction,
  })
  action: TaskAction;

  @Column({ nullable: true })
  oldValue: string | null;

  @Column({ nullable: true })
  newValue: string | null;

  @ManyToOne(() => User, { nullable: true })
  user: User | null;

  @CreateDateColumn()
  timestamp: Date;
}
