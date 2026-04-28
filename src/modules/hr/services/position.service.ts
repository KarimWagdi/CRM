import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../entities/position.entity';
import { CreatePositionDto, UpdatePositionDto } from '../dto/position.dto';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
  ) {}

  findAll(): Promise<Position[]> {
    return this.positionRepository.find();
  }

  async findOne(id: number): Promise<Position> {
    const position = await this.positionRepository.findOneBy({ id });
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return position;
  }

  create(createPositionDto: CreatePositionDto): Promise<Position> {
    const position = this.positionRepository.create(createPositionDto);
    return this.positionRepository.save(position);
  }

  async update(id: number, updatePositionDto: UpdatePositionDto): Promise<Position> {
    const position = await this.findOne(id);
    this.positionRepository.merge(position, updatePositionDto);
    return this.positionRepository.save(position);
  }

  async remove(id: number): Promise<void> {
    const result = await this.positionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
  }
}
