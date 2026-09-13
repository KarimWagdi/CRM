import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatRoom, RoomType } from '../entities/chat-room.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../hr/entities/department.entity';

describe('ChatService', () => {
  let service: ChatService;
  let roomRepo: any;
  let messageRepo: any;
  let userRepo: any;
  let deptRepo: any;

  beforeEach(async () => {
    roomRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve({ id: 1, ...entity })),
    };

    messageRepo = {
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve({ id: 10, ...entity })),
      findOneBy: jest.fn(),
      find: jest.fn(),
    };

    userRepo = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };

    deptRepo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(ChatRoom),
          useValue: roomRepo,
        },
        {
          provide: getRepositoryToken(ChatMessage),
          useValue: messageRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepo,
        },
        {
          provide: getRepositoryToken(Department),
          useValue: deptRepo,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ensureCompanyRoom', () => {
    it('should create company room if it does not exist', async () => {
      roomRepo.findOne.mockResolvedValue(null);
      await service.ensureCompanyRoom();
      expect(roomRepo.create).toHaveBeenCalledWith({
        name: 'Company-wide Chat',
        type: RoomType.COMPANY,
      });
      expect(roomRepo.save).toHaveBeenCalled();
    });

    it('should not create company room if it already exists', async () => {
      roomRepo.findOne.mockResolvedValue({ id: 1, type: RoomType.COMPANY });
      await service.ensureCompanyRoom();
      expect(roomRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('saveMessage', () => {
    it('should create and save a new message', async () => {
      const room = { id: 1 };
      const sender = { id: 2, username: 'john' };
      roomRepo.findOneBy.mockResolvedValue(room);
      userRepo.findOne.mockResolvedValue(sender);

      const result = await service.saveMessage(2, 1, 'Hello World');

      expect(messageRepo.create).toHaveBeenCalledWith({
        content: 'Hello World',
        room,
        sender,
      });
      expect(messageRepo.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 10);
    });

    it('should throw error if room is not found', async () => {
      roomRepo.findOneBy.mockResolvedValue(null);
      await expect(service.saveMessage(2, 999, 'Test')).rejects.toThrow(
        'Room with ID 999 not found',
      );
    });
  });
});
