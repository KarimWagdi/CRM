import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Board } from './entities/board.entity';
import { List } from './entities/list.entity';
import { Task } from './entities/task.entity';
import { TaskHistory } from './entities/task-history.entity';
import { Account } from '../crm/entities/account.entity';
import { Employee } from '../hr/entities/employee.entity';
import { User } from '../users/entities/user.entity';
import { ProjectService } from './services/project.service';
import { BoardService } from './services/board.service';
import { ListService } from './services/list.service';
import { TaskService } from './services/task.service';
import { ProjectController } from './controllers/project.controller';
import { BoardController } from './controllers/board.controller';
import { ListController } from './controllers/list.controller';
import { TaskController } from './controllers/task.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Board, List, Task, TaskHistory, Account, Employee, User]),
    UsersModule,
  ],
  controllers: [
    ProjectController,
    BoardController,
    ListController,
    TaskController,
  ],
  providers: [ProjectService, BoardService, ListService, TaskService],
})
export class TasksModule {}
