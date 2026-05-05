import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { List } from '../entities/list.entity';
import { Employee } from '../../hr/entities/employee.entity';
import { TaskHistory, TaskAction } from '../entities/task-history.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(TaskHistory)
    private historyRepository: Repository<TaskHistory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async create(createTaskDto: CreateTaskDto, userId?: number): Promise<Task> {
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

    const savedTask = await this.taskRepository.save(task);

    if (assigneeId && userId) {
      await this.recordHistory(
        savedTask,
        TaskAction.ASSIGNED,
        null,
        assigneeId.toString(),
        userId,
      );
    }

    return savedTask;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId?: number): Promise<Task> {
    const task = await this.findOne(id);
    const { listId, assigneeId, ...taskData } = updateTaskDto;

    const oldListId = task.list?.id;
    const oldAssigneeId = task.assignee?.id;

    if (listId && listId !== oldListId) {
      const list = await this.listRepository.findOneBy({ id: listId });
      if (!list) throw new NotFoundException(`List with ID ${listId} not found`);
      task.list = list;

      if (userId) {
        await this.recordHistory(
          task,
          TaskAction.STATUS_CHANGE,
          oldListId?.toString() || null,
          listId.toString(),
          userId,
        );
      }
    }

    if (assigneeId !== undefined && assigneeId !== oldAssigneeId) {
      if (assigneeId === null) {
        task.assignee = null as any;
      } else {
        const assignee = await this.employeeRepository.findOneBy({ id: assigneeId });
        if (!assignee) throw new NotFoundException(`Employee with ID ${assigneeId} not found`);
        task.assignee = assignee;
      }

      if (userId) {
        await this.recordHistory(
          task,
          TaskAction.ASSIGNED,
          oldAssigneeId?.toString() || null,
          assigneeId?.toString() || null,
          userId,
        );
      }
    }

    this.taskRepository.merge(task, taskData);
    return this.taskRepository.save(task);
  }

  private async recordHistory(
    task: Task,
    action: TaskAction,
    oldValue: string | null,
    newValue: string | null,
    userId: number,
  ) {
    const history = new TaskHistory();
    history.task = { id: task.id } as Task;
    history.action = action;
    history.oldValue = oldValue;
    history.newValue = newValue;
    history.user = { id: userId } as User;

    await this.historyRepository.save(history);
  }

  async getHistory(taskId: number): Promise<TaskHistory[]> {
    return this.historyRepository.find({
      where: { task: { id: taskId } },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
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
