import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../entities/lead.entity';
import { CreateLeadDto, UpdateLeadDto } from '../dto/lead.dto';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
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

  create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create(createLeadDto);
    return this.leadRepository.save(lead);
  }

  async update(id: number, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);
    this.leadRepository.merge(lead, updateLeadDto);
    return this.leadRepository.save(lead);
  }

  async remove(id: number): Promise<void> {
    const result = await this.leadRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
  }
}
