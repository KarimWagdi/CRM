import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { AuditLog } from '../entities/audit-log.entity';

describe('AuditService', () => {
  let service: AuditService;
  let auditRepo: any;

  beforeEach(async () => {
    auditRepo = {
      create: jest.fn((dto) => dto),
      save: jest.fn((log) => Promise.resolve({ id: 1, ...log })),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: auditRepo,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and save an audit log entry', async () => {
    const result = await service.logAction(
      'UPDATE',
      'Lead',
      10,
      'Updated status to Qualified',
      'admin_user',
    );

    expect(auditRepo.create).toHaveBeenCalledWith({
      action: 'UPDATE',
      entityName: 'Lead',
      entityId: '10',
      details: 'Updated status to Qualified',
      performedBy: 'admin_user',
    });
    expect(auditRepo.save).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 1);
  });
});
