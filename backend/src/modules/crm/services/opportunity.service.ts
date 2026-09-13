import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity, OpportunityStage } from '../entities/opportunity.entity';
import { CreateOpportunityDto, UpdateOpportunityDto } from '../dto/opportunity.dto';
import { Account } from '../entities/account.entity';
import { InvoiceService } from '../../accounting/services/invoice.service';
import { AuditService } from '../../audit/services/audit.service';

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(Opportunity)
    private opportunityRepository: Repository<Opportunity>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private invoiceService: InvoiceService,
    @Optional() private auditService?: AuditService,
  ) {}

  findAll(): Promise<Opportunity[]> {
    return this.opportunityRepository.find({ relations: ['account'] });
  }

  async findOne(id: number): Promise<Opportunity> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id },
      relations: ['account'],
    });
    if (!opportunity) {
      throw new NotFoundException(`Opportunity with ID ${id} not found`);
    }
    return opportunity;
  }

  async create(createOpportunityDto: CreateOpportunityDto): Promise<Opportunity> {
    const { accountId, ...opportunityData } = createOpportunityDto;
    const account = await this.accountRepository.findOneBy({ id: accountId });
    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }
    const opportunity = this.opportunityRepository.create({
      ...opportunityData,
      account,
    });
    const saved = await this.opportunityRepository.save(opportunity);
    if (this.auditService) {
      await this.auditService.logAction('CREATE', 'Opportunity', saved.id, `Created opportunity ${saved.name}`);
    }
    return saved;
  }

  async update(id: number, updateOpportunityDto: UpdateOpportunityDto): Promise<Opportunity> {
    const opportunity = await this.findOne(id);
    const previousStage = opportunity.stage;
    const { accountId, ...opportunityData } = updateOpportunityDto;

    if (accountId) {
      const account = await this.accountRepository.findOneBy({ id: accountId });
      if (!account) {
        throw new NotFoundException(`Account with ID ${accountId} not found`);
      }
      opportunity.account = account;
    }

    this.opportunityRepository.merge(opportunity, opportunityData);
    const updatedOpportunity = await this.opportunityRepository.save(opportunity);

    // Automation Trigger: If transitioned to Closed Won, automatically generate draft invoice
    if (previousStage !== OpportunityStage.CLOSED_WON && updatedOpportunity.stage === OpportunityStage.CLOSED_WON) {
      const fullOpportunity = updatedOpportunity.account
        ? updatedOpportunity
        : await this.findOne(updatedOpportunity.id);

      if (fullOpportunity.account) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        await this.invoiceService.create({
          invoiceNumber: `INV-WON-${fullOpportunity.id}-${Date.now()}`,
          accountId: fullOpportunity.account.id,
          issueDate: new Date(),
          dueDate,
          totalAmount: fullOpportunity.amount || 0,
          status: 'Draft' as any,
        });
      }
    }

    return updatedOpportunity;
  }

  async remove(id: number): Promise<void> {
    const result = await this.opportunityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Opportunity with ID ${id} not found`);
    }
    if (this.auditService) {
      await this.auditService.logAction('DELETE', 'Opportunity', id, `Deleted opportunity ${id}`);
    }
  }

  async getStats() {
    const total = await this.opportunityRepository.count();
    const stageCounts = await this.opportunityRepository
      .createQueryBuilder('opportunity')
      .select('opportunity.stage', 'stage')
      .addSelect('COUNT(opportunity.id)', 'count')
      .addSelect('SUM(opportunity.amount)', 'totalAmount')
      .groupBy('opportunity.stage')
      .getRawMany();

    const totalValue = await this.opportunityRepository
      .createQueryBuilder('opportunity')
      .select('SUM(opportunity.amount)', 'total')
      .getRawOne();

    return {
      total,
      totalValue: totalValue.total || 0,
      stageCounts,
    };
  }
}
