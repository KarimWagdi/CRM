import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../entities/list.entity';
import { CreateListDto, UpdateListDto } from '../dto/list.dto';
import { Board } from '../entities/board.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  findAll(): Promise<List[]> {
    return this.listRepository.find({ relations: ['board'] });
  }

  async findOne(id: number): Promise<List> {
    const list = await this.listRepository.findOne({
      where: { id },
      relations: ['board', 'tasks'],
    });
    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }
    return list;
  }

  async create(createListDto: CreateListDto): Promise<List> {
    const { boardId, ...listData } = createListDto;
    const board = await this.boardRepository.findOneBy({ id: boardId });
    if (!board) throw new NotFoundException(`Board with ID ${boardId} not found`);

    const list = this.listRepository.create({
      ...listData,
      board,
    });
    return this.listRepository.save(list);
  }

  async update(id: number, updateListDto: UpdateListDto): Promise<List> {
    const list = await this.findOne(id);
    const { boardId, ...listData } = updateListDto;

    if (boardId) {
      const board = await this.boardRepository.findOneBy({ id: boardId });
      if (!board) throw new NotFoundException(`Board with ID ${boardId} not found`);
      list.board = board;
    }

    this.listRepository.merge(list, listData);
    return this.listRepository.save(list);
  }

  async remove(id: number): Promise<void> {
    const result = await this.listRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }
  }
}
