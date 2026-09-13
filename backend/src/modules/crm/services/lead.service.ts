import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../entities/lead.entity';
import { CreateLeadDto, UpdateLeadDto } from '../dto/lead.dto';
import { AuditService } from '../../audit/services/audit.service';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @Optional() private auditService?: AuditService,
  ) {}

  findAll(): Promise<Lead[]> {
    return this.leadRepository.find();
  }

  async findOne(id: number): Promise<Lead> {
    const lead = await this.leadRepository.findOneBy({ id });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create(createLeadDto);
    const saved = await this.leadRepository.save(lead);
    if (this.auditService) {
      await this.auditService.logAction('CREATE', 'Lead', saved.id, `Created lead ${saved.firstName} ${saved.lastName}`);
    }
    return saved;
  }

  async update(id: number, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);
    this.leadRepository.merge(lead, updateLeadDto);
    const updated = await this.leadRepository.save(lead);
    if (this.auditService) {
      await this.auditService.logAction('UPDATE', 'Lead', updated.id, `Updated lead ${updated.id}`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const result = await this.leadRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    if (this.auditService) {
      await this.auditService.logAction('DELETE', 'Lead', id, `Deleted lead ${id}`);
    }
  }

  async getStats() {
    const total = await this.leadRepository.count();
    const statusCounts = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.status', 'status')
      .addSelect('COUNT(lead.id)', 'count')
      .groupBy('lead.status')
      .getRawMany();

    const recentLeads = await this.leadRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      total,
      statusCounts,
      recentLeads,
    };
  }
}
