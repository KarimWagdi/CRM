import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Department } from './entities/department.entity';
import { Position } from './entities/position.entity';
import { LeaveRequest } from './entities/leave-request.entity';
import { Attendance } from './entities/attendance.entity';
import { Salary } from './entities/salary.entity';
import { PerformanceReview } from './entities/performance-review.entity';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { EmployeeService } from './services/employee.service';
import { DepartmentService } from './services/department.service';
import { PositionService } from './services/position.service';
import { LeaveRequestService } from './services/leave-request.service';
import { AttendanceService } from './services/attendance.service';
import { SalaryService } from './services/salary.service';
import { PerformanceService } from './services/performance.service';
import { EmployeeController } from './controllers/employee.controller';
import { DepartmentController } from './controllers/department.controller';
import { PositionController } from './controllers/position.controller';
import { LeaveRequestController } from './controllers/leave-request.controller';
import { AttendanceController } from './controllers/attendance.controller';
import { SalaryController } from './controllers/salary.controller';
import { PerformanceController } from './controllers/performance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Department,
      Position,
      LeaveRequest,
      Attendance,
      Salary,
      PerformanceReview,
      User,
      Task,
    ]),
  ],
  controllers: [
    EmployeeController,
    DepartmentController,
    PositionController,
    LeaveRequestController,
    AttendanceController,
    SalaryController,
    PerformanceController,
  ],
  providers: [
    EmployeeService,
    DepartmentService,
    PositionService,
    LeaveRequestService,
    AttendanceService,
    SalaryService,
    PerformanceService,
  ],
})
export class HrModule {}
