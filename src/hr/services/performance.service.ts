import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformanceReview } from '../entities/performance-review.entity';
import { Employee } from '../entities/employee.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Attendance } from '../entities/attendance.entity';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(PerformanceReview)
    private reviewRepository: Repository<PerformanceReview>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  findAll(): Promise<PerformanceReview[]> {
    return this.reviewRepository.find({ relations: ['employee', 'reviewer'] });
  }

  findByEmployee(employeeId: number): Promise<PerformanceReview[]> {
    return this.reviewRepository.find({
      where: { employee: { id: employeeId } },
      relations: ['employee', 'reviewer'],
    });
  }

  async create(reviewData: any): Promise<PerformanceReview> {
    const employee = await this.employeeRepository.findOneBy({ id: reviewData.employeeId });
    if (!employee) throw new NotFoundException('Employee not found');

    const reviewer = await this.employeeRepository.findOneBy({ id: reviewData.reviewerId });
    if (!reviewer) throw new NotFoundException('Reviewer not found');

    const review = this.reviewRepository.create({
      period: reviewData.period,
      score: reviewData.score,
      comments: reviewData.comments,
      metrics: reviewData.metrics,
      employee,
      reviewer,
      reviewDate: new Date(),
    });

    return this.reviewRepository.save(review);
  }

  async calculateMetrics(employeeId: number, startDate: Date, endDate: Date) {
    const { Between } = await import('typeorm');

    const tasksCompleted = await this.taskRepository.count({
      where: {
        assignee: { id: employeeId },
        // Assuming there is a status or list that indicates completion
        // For simplicity, we just count tasks assigned in this period
        createdAt: Between(startDate, endDate) as any,
      },
    });

    const attendanceRecords = await this.attendanceRepository.count({
      where: {
        employee: { id: employeeId },
        date: Between(startDate, endDate) as any,
      },
    });

    // Calculate working days in the period (approximate: total days * 5/7)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const workingDays = Math.max(Math.floor(totalDays * 5 / 7), 1);

    const attendanceRate = attendanceRecords / workingDays;

    return {
      tasksCompleted,
      attendanceRecords,
      attendanceRate: Math.min(attendanceRate, 1),
      workingDays,
    };
  }
}
