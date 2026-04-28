import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { CreateBoardDto, UpdateBoardDto } from '../dto/board.dto';
import { Project } from '../entities/project.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  findAll(): Promise<Board[]> {
    return this.boardRepository.find({ relations: ['project'] });
  }

  async findOne(id: number): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: ['project', 'lists'],
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    return board;
  }

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const { projectId, ...boardData } = createBoardDto;
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException(`Project with ID ${projectId} not found`);

    const board = this.boardRepository.create({
      ...boardData,
      project,
    });
    return this.boardRepository.save(board);
  }

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const board = await this.findOne(id);
    const { projectId, ...boardData } = updateBoardDto;

    if (projectId) {
      const project = await this.projectRepository.findOneBy({ id: projectId });
      if (!project) throw new NotFoundException(`Project with ID ${projectId} not found`);
      board.project = project;
    }

    this.boardRepository.merge(board, boardData);
    return this.boardRepository.save(board);
  }

  async remove(id: number): Promise<void> {
    const result = await this.boardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
  }
}
