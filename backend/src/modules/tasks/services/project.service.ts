import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { Account } from '../../crm/entities/account.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['account'] });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['account'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { accountId, ...projectData } = createProjectDto;
    const account = await this.accountRepository.findOneBy({ id: accountId });
    if (!account) throw new NotFoundException(`Account with ID ${accountId} not found`);

    const project = this.projectRepository.create({
      ...projectData,
      account,
    });
    return this.projectRepository.save(project);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    const { accountId, ...projectData } = updateProjectDto;

    if (accountId) {
      const account = await this.accountRepository.findOneBy({ id: accountId });
      if (!account) throw new NotFoundException(`Account with ID ${accountId} not found`);
      project.account = account;
    }

    this.projectRepository.merge(project, projectData);
    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async getStats() {
    const totalCount = await this.projectRepository.count();
    const recentProjects = await this.projectRepository.find({
      relations: ['account'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalCount,
      recentProjects,
    };
  }
}
