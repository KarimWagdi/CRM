import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LeadService } from './lead.service';
import { Lead, LeadStatus } from '../entities/lead.entity';

describe('LeadService', () => {
  let service: LeadService;
  let leadRepo: any;

  beforeEach(async () => {
    leadRepo = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((lead) => Promise.resolve({ id: 1, ...lead })),
      delete: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadService,
        {
          provide: getRepositoryToken(Lead),
          useValue: leadRepo,
        },
      ],
    }).compile();

    service = module.get<LeadService>(LeadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a lead', async () => {
    const dto = {
      firstName: 'Alice',
      lastName: 'Wonder',
      email: 'alice@example.com',
      company: 'Wonderland Inc',
      status: LeadStatus.NEW,
    };
    const result = await service.create(dto);
    expect(leadRepo.create).toHaveBeenCalledWith(dto);
    expect(leadRepo.save).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 1);
  });
});
