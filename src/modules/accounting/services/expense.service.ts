import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';
import { CreateExpenseDto, UpdateExpenseDto } from '../dto/expense.dto';
import { Employee } from '../../hr/entities/employee.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  findAll(): Promise<Expense[]> {
    return this.expenseRepository.find({ relations: ['employee'] });
  }

  async findOne(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!expense) {
      throw new NotFoundException(`Expense record with ID ${id} not found`);
    }
    return expense;
  }

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const { employeeId, ...expenseData } = createExpenseDto;
    const employee = await this.employeeRepository.findOneBy({ id: employeeId });
    if (!employee) throw new NotFoundException(`Employee with ID ${employeeId} not found`);

    const expense = this.expenseRepository.create({
      ...expenseData,
      employee,
    });
    return this.expenseRepository.save(expense);
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.findOne(id);
    const { employeeId, ...expenseData } = updateExpenseDto;

    if (employeeId) {
      const employee = await this.employeeRepository.findOneBy({ id: employeeId });
      if (!employee) throw new NotFoundException(`Employee with ID ${employeeId} not found`);
      expense.employee = employee;
    }

    this.expenseRepository.merge(expense, expenseData);
    return this.expenseRepository.save(expense);
  }

  async remove(id: number): Promise<void> {
    const result = await this.expenseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Expense record with ID ${id} not found`);
    }
  }

  async getStats() {
    const totalAmount = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .getRawOne();

    const categoryCounts = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('expense.category', 'category')
      .addSelect('SUM(expense.amount)', 'total')
      .groupBy('expense.category')
      .getRawMany();

    return {
      totalAmount: parseFloat(totalAmount.total || 0),
      categoryCounts,
    };
  }
}
