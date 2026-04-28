import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto/employee.dto';
import { Department } from '../entities/department.entity';
import { Position } from '../entities/position.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({ relations: ['department', 'position', 'user'] });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['department', 'position', 'user'],
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const { departmentId, positionId, userId, ...employeeData } = createEmployeeDto;

    const department = await this.departmentRepository.findOneBy({ id: departmentId });
    if (!department) throw new NotFoundException(`Department with ID ${departmentId} not found`);

    const position = await this.positionRepository.findOneBy({ id: positionId });
    if (!position) throw new NotFoundException(`Position with ID ${positionId} not found`);

    const employee = this.employeeRepository.create({
      ...employeeData,
      department,
      position,
    });

    if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
      employee.user = user;
    }

    return this.employeeRepository.save(employee);
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    const { departmentId, positionId, userId, ...employeeData } = updateEmployeeDto;

    if (departmentId) {
      const department = await this.departmentRepository.findOneBy({ id: departmentId });
      if (!department) throw new NotFoundException(`Department with ID ${departmentId} not found`);
      employee.department = department;
    }

    if (positionId) {
      const position = await this.positionRepository.findOneBy({ id: positionId });
      if (!position) throw new NotFoundException(`Position with ID ${positionId} not found`);
      employee.position = position;
    }

    if (userId !== undefined) {
      if (userId === null) {
        employee.user = null as any;
      } else {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
        employee.user = user;
      }
    }

    this.employeeRepository.merge(employee, employeeData);
    return this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const result = await this.employeeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }
}
