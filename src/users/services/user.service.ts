import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { roleId, ...userData } = createUserDto;
    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) throw new NotFoundException(`Role with ID ${roleId} not found`);

    const user = this.userRepository.create({
      ...userData,
      role,
    });
    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { roleId, ...userData } = updateUserDto;

    if (roleId) {
      const role = await this.roleRepository.findOneBy({ id: roleId });
      if (!role) throw new NotFoundException(`Role with ID ${roleId} not found`);
      user.role = role;
    }

    this.userRepository.merge(user, userData);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
