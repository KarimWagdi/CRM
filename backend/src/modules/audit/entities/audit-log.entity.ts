import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string; // e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'

  @Column()
  entityName: string; // e.g., 'Lead', 'Opportunity', 'Invoice'

  @Column({ nullable: true })
  entityId: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ nullable: true })
  performedBy: string; // username or user ID

  @CreateDateColumn()
  createdAt: Date;
}
