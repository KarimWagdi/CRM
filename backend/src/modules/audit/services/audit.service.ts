import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async logAction(
    action: string,
    entityName: string,
    entityId?: string | number,
    details?: string,
    performedBy?: string,
  ): Promise<AuditLog> {
    const log = this.auditRepository.create({
      action,
      entityName,
      entityId: entityId ? String(entityId) : undefined,
      details,
      performedBy: performedBy || 'SYSTEM',
    });
    return this.auditRepository.save(log);
  }

  async findAll(limit = 100): Promise<AuditLog[]> {
    return this.auditRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByEntity(entityName: string, entityId: string): Promise<AuditLog[]> {
    return this.auditRepository.find({
      where: { entityName, entityId },
      order: { createdAt: 'DESC' },
    });
  }
}
