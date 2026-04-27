import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Board } from './entities/board.entity';
import { List } from './entities/list.entity';
import { Task } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Board, List, Task])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class TasksModule {}
