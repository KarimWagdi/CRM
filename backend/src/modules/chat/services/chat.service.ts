import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, TreeRepository } from 'typeorm';
import { ChatRoom, RoomType } from '../entities/chat-room.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../hr/entities/department.entity';

@Injectable()
export class ChatService implements OnModuleInit {
  constructor(
    @InjectRepository(ChatRoom)
    private roomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private messageRepository: TreeRepository<ChatMessage>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async onModuleInit() {
    await this.ensureCompanyRoom();
    await this.ensureDepartmentRooms();
  }

  async ensureCompanyRoom() {
    let companyRoom = await this.roomRepository.findOne({ where: { type: RoomType.COMPANY } });
    if (!companyRoom) {
      companyRoom = this.roomRepository.create({
        name: 'Company-wide Chat',
        type: RoomType.COMPANY,
      });
      await this.roomRepository.save(companyRoom);
    }
  }

  async ensureDepartmentRooms() {
    const departments = await this.departmentRepository.find();
    for (const dept of departments) {
      let deptRoom = await this.roomRepository.findOne({
        where: { type: RoomType.DEPARTMENT, departmentId: dept.id },
      });
      if (!deptRoom) {
        deptRoom = this.roomRepository.create({
          name: `${dept.name} Department`,
          type: RoomType.DEPARTMENT,
          departmentId: dept.id,
        });
        await this.roomRepository.save(deptRoom);
      }
    }
  }

  async getRoomsForUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['employee', 'employee.department'],
    });

    if (!user) return [];

    const rooms = await this.roomRepository.find({
      where: [
        { type: RoomType.COMPANY },
        { type: RoomType.DEPARTMENT, departmentId: user.employee?.department?.id },
        { participants: { id: userId } },
      ],
      relations: ['participants'],
    });

    return rooms;
  }

  async getOrCreateDirectRoom(user1Id: number, user2Id: number) {
    const rooms = await this.roomRepository.find({
      where: { type: RoomType.DIRECT },
      relations: ['participants'],
    });

    let directRoom = rooms.find(r =>
      r.participants.some(p => p.id === user1Id) &&
      r.participants.some(p => p.id === user2Id)
    );

    if (!directRoom) {
      const user1 = await this.userRepository.findOneBy({ id: user1Id });
      const user2 = await this.userRepository.findOneBy({ id: user2Id });
      const participants = [user1, user2].filter((u): u is User => u !== null);
      directRoom = this.roomRepository.create({
        type: RoomType.DIRECT,
        participants,
      });
      await this.roomRepository.save(directRoom);
    }

    return directRoom;
  }

  async saveMessage(userId: number, roomId: number, content: string, parentId?: number) {
    const room = await this.roomRepository.findOneBy({ id: roomId });
    if (!room) {
      throw new Error(`Room with ID ${roomId} not found`);
    }
    const sender = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['employee', 'employee.position'],
    });

    const message = this.messageRepository.create({
      content,
      room,
      sender: sender || undefined,
    });

    if (parentId) {
      const parent = await this.messageRepository.findOneBy({ id: parentId });
      if (parent) {
        message.parent = parent;
      }
    }

    return this.messageRepository.save(message);
  }

  async getMessages(roomId: number) {
    const messages = await this.messageRepository.find({
      where: { room: { id: roomId } },
      relations: ['sender', 'sender.employee', 'sender.employee.position', 'parent'],
      order: { createdAt: 'ASC' },
    });
    return messages;
  }
}
