import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Contact } from './contact.entity';
import { Opportunity } from './opportunity.entity';

export enum ActivityType {
  CALL = 'Call',
  EMAIL = 'Email',
  MEETING = 'Meeting',
  TASK = 'Task',
}

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'simple-enum',
    enum: ActivityType,
    default: ActivityType.TASK,
  })
  type: ActivityType;

  @Column()
  subject: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  dueDate: Date;

  @ManyToOne(() => Contact, (contact) => contact.activities, { nullable: true })
  contact: Contact;

  @ManyToOne(() => Opportunity, (opportunity) => opportunity.activities, { nullable: true })
  opportunity: Opportunity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
