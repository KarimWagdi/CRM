import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Contact } from './contact.entity';
import { Opportunity } from './opportunity.entity';
import { Project } from '../../tasks/entities/project.entity';
import { Invoice } from '../../accounting/entities/invoice.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Contact, (contact) => contact.account)
  contacts: Contact[];

  @OneToMany(() => Opportunity, (opportunity) => opportunity.account)
  opportunities: Opportunity[];

  @OneToMany(() => Project, (project) => project.account)
  projects: Project[];

  @OneToMany(() => Invoice, (invoice) => invoice.account)
  invoices: Invoice[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
