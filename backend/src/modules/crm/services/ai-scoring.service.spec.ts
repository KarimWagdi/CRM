import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AiScoringService } from './ai-scoring.service';
import { Lead, LeadStatus } from '../entities/lead.entity';

describe('AiScoringService', () => {
  let service: AiScoringService;
  let leadRepo: any;

  beforeEach(async () => {
    leadRepo = {
      findOneBy: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiScoringService,
        {
          provide: getRepositoryToken(Lead),
          useValue: leadRepo,
        },
      ],
    }).compile();

    service = module.get<AiScoringService>(AiScoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should score a qualified lead with high score', async () => {
    const mockLead = {
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@acme.com',
      company: 'Acme Corp',
      status: LeadStatus.QUALIFIED,
      source: 'Referral Partner',
    };
    leadRepo.findOneBy.mockResolvedValue(mockLead);

    const result = await service.scoreLead(1);

    expect(result.leadId).toBe(1);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.grade).toBe('A');
    expect(result.conversionProbability).toBeGreaterThanOrEqual(0.8);
  });

  it('should score a lost lead with low score', async () => {
    const mockLead = {
      id: 2,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@test.com',
      company: null,
      status: LeadStatus.LOST,
      source: 'Cold Call',
    };
    leadRepo.findOneBy.mockResolvedValue(mockLead);

    const result = await service.scoreLead(2);

    expect(result.score).toBeLessThan(40);
    expect(result.grade).toBe('D');
  });
});
