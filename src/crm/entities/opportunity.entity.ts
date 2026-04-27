import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Account } from './account.entity';
import { Activity } from './activity.entity';

export enum OpportunityStage {
  PROSPECTING = 'Prospecting',
  QUALIFICATION = 'Qualification',
  PROPOSAL = 'Proposal',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost',
}

@Entity()
export class Opportunity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({
    type: 'simple-enum',
    enum: OpportunityStage,
    default: OpportunityStage.PROSPECTING,
  })
  stage: OpportunityStage;

  @Column({ type: 'date', nullable: true })
  closeDate: Date;

  @ManyToOne(() => Account, (account) => account.opportunities)
  account: Account;

  @OneToMany(() => Activity, (activity) => activity.opportunity)
  activities: Activity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
