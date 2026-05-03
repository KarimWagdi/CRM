import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { CreateAccountDto, UpdateAccountDto } from '../dto/account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  findAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  async findOne(id: number): Promise<Account> {
    const account = await this.accountRepository.findOneBy({ id });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create(createAccountDto);
    return this.accountRepository.save(account);
  }

  async update(id: number, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const account = await this.findOne(id);
    this.accountRepository.merge(account, updateAccountDto);
    return this.accountRepository.save(account);
  }

  async remove(id: number): Promise<void> {
    const result = await this.accountRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
  }

  async getStats() {
    const totalCount = await this.accountRepository.count();
    const industryCounts = await this.accountRepository
      .createQueryBuilder('account')
      .select('account.industry', 'industry')
      .addSelect('COUNT(account.id)', 'count')
      .groupBy('account.industry')
      .getRawMany();

    return {
      totalCount,
      industryCounts,
    };
  }
}
