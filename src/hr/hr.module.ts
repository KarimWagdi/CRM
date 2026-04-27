import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Department } from './entities/department.entity';
import { Position } from './entities/position.entity';
import { LeaveRequest } from './entities/leave-request.entity';
import { Attendance } from './entities/attendance.entity';
import { User } from '../users/entities/user.entity';
import { EmployeeService } from './services/employee.service';
import { DepartmentService } from './services/department.service';
import { PositionService } from './services/position.service';
import { LeaveRequestService } from './services/leave-request.service';
import { AttendanceService } from './services/attendance.service';
import { EmployeeController } from './controllers/employee.controller';
import { DepartmentController } from './controllers/department.controller';
import { PositionController } from './controllers/position.controller';
import { LeaveRequestController } from './controllers/leave-request.controller';
import { AttendanceController } from './controllers/attendance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Department,
      Position,
      LeaveRequest,
      Attendance,
      User,
    ]),
  ],
  controllers: [
    EmployeeController,
    DepartmentController,
    PositionController,
    LeaveRequestController,
    AttendanceController,
  ],
  providers: [
    EmployeeService,
    DepartmentService,
    PositionService,
    LeaveRequestService,
    AttendanceService,
  ],
})
export class HrModule {}
