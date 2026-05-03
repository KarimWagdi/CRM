import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest } from '../entities/leave-request.entity';
import { CreateLeaveRequestDto, UpdateLeaveRequestDto } from '../dto/leave-request.dto';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  findAll(): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find({ relations: ['employee'] });
  }

  async findOne(id: number): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!leaveRequest) {
      throw new NotFoundException(`Leave request with ID ${id} not found`);
    }
    return leaveRequest;
  }

  async create(createLeaveRequestDto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    const { employeeId, ...leaveRequestData } = createLeaveRequestDto;
    const employee = await this.employeeRepository.findOneBy({ id: employeeId });
    if (!employee) throw new NotFoundException(`Employee with ID ${employeeId} not found`);

    const leaveRequest = this.leaveRequestRepository.create({
      ...leaveRequestData,
      employee,
    });
    return this.leaveRequestRepository.save(leaveRequest);
  }

  async update(id: number, updateLeaveRequestDto: UpdateLeaveRequestDto): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id);
    const { employeeId, ...leaveRequestData } = updateLeaveRequestDto;

    if (employeeId) {
      const employee = await this.employeeRepository.findOneBy({ id: employeeId });
      if (!employee) throw new NotFoundException(`Employee with ID ${employeeId} not found`);
      leaveRequest.employee = employee;
    }

    this.leaveRequestRepository.merge(leaveRequest, leaveRequestData);
    return this.leaveRequestRepository.save(leaveRequest);
  }

  async remove(id: number): Promise<void> {
    const result = await this.leaveRequestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Leave request with ID ${id} not found`);
    }
  }

  async getStats() {
    const totalCount = await this.leaveRequestRepository.count();
    const pendingCount = await this.leaveRequestRepository.count({ where: { status: 'Pending' as any } });
    const recentRequests = await this.leaveRequestRepository.find({
      relations: ['employee'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalCount,
      pendingCount,
      recentRequests,
    };
  }
}
