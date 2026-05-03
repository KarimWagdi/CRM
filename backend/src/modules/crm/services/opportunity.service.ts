import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity } from '../entities/opportunity.entity';
import { CreateOpportunityDto, UpdateOpportunityDto } from '../dto/opportunity.dto';
import { Account } from '../entities/account.entity';

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(Opportunity)
    private opportunityRepository: Repository<Opportunity>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
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
    return this.opportunityRepository.save(opportunity);
  }

  async update(id: number, updateOpportunityDto: UpdateOpportunityDto): Promise<Opportunity> {
    const opportunity = await this.findOne(id);
    const { accountId, ...opportunityData } = updateOpportunityDto;

    if (accountId) {
      const account = await this.accountRepository.findOneBy({ id: accountId });
      if (!account) {
        throw new NotFoundException(`Account with ID ${accountId} not found`);
      }
      opportunity.account = account;
    }

    this.opportunityRepository.merge(opportunity, opportunityData);
    return this.opportunityRepository.save(opportunity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.opportunityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Opportunity with ID ${id} not found`);
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
