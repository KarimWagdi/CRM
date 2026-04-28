import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { CreateAttendanceDto, UpdateAttendanceDto } from '../dto/attendance.dto';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({ relations: ['employee'] });
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    return attendance;
  }

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const { employeeId, ...attendanceData } = createAttendanceDto;
    const employee = await this.employeeRepository.findOneBy({ id: employeeId });
    if (!employee) throw new NotFoundException(`Employee with ID ${employeeId} not found`);

    const attendance = this.attendanceRepository.create({
      ...attendanceData,
      employee,
    });
    return this.attendanceRepository.save(attendance);
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);
    const { employeeId, ...attendanceData } = updateAttendanceDto;

    if (employeeId) {
      const employee = await this.employeeRepository.findOneBy({ id: employeeId });
      if (!employee) throw new NotFoundException(`Employee with ID ${employeeId} not found`);
      attendance.employee = employee;
    }

    this.attendanceRepository.merge(attendance, attendanceData);
    return this.attendanceRepository.save(attendance);
  }

  async remove(id: number): Promise<void> {
    const result = await this.attendanceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.date = :today', { today: today.toISOString().split('T')[0] })
      .getCount();

    const statusCounts = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .select('attendance.status', 'status')
      .addSelect('COUNT(attendance.id)', 'count')
      .groupBy('attendance.status')
      .getRawMany();

    return {
      todayCount,
      statusCounts,
    };
  }
}
