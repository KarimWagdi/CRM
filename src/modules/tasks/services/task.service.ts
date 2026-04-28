import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { List } from '../entities/list.entity';
import { Employee } from '../../hr/entities/employee.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['list', 'assignee'] });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['list', 'assignee'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { listId, assigneeId, ...taskData } = createTaskDto;

    const list = await this.listRepository.findOneBy({ id: listId });
    if (!list) throw new NotFoundException(`List with ID ${listId} not found`);

    const task = this.taskRepository.create({
      ...taskData,
      list,
    });

    if (assigneeId) {
      const assignee = await this.employeeRepository.findOneBy({ id: assigneeId });
      if (!assignee) throw new NotFoundException(`Employee with ID ${assigneeId} not found`);
      task.assignee = assignee;
    }

    return this.taskRepository.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    const { listId, assigneeId, ...taskData } = updateTaskDto;

    if (listId) {
      const list = await this.listRepository.findOneBy({ id: listId });
      if (!list) throw new NotFoundException(`List with ID ${listId} not found`);
      task.list = list;
    }

    if (assigneeId !== undefined) {
      if (assigneeId === null) {
        task.assignee = null as any;
      } else {
        const assignee = await this.employeeRepository.findOneBy({ id: assigneeId });
        if (!assignee) throw new NotFoundException(`Employee with ID ${assigneeId} not found`);
        task.assignee = assignee;
      }
    }

    this.taskRepository.merge(task, taskData);
    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async getStats() {
    const totalCount = await this.taskRepository.count();
    const completedCount = await this.taskRepository
      .createQueryBuilder('task')
      .innerJoin('task.list', 'list')
      .where('LOWER(list.name) LIKE :name', { name: '%done%' })
      .orWhere('LOWER(list.name) LIKE :name2', { name2: '%completed%' })
      .getCount();

    const recentTasks = await this.taskRepository.find({
      relations: ['list', 'assignee'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalCount,
      completedCount,
      recentTasks,
    };
  }
}
