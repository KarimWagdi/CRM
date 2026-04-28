import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Employee } from '../entities/employee.entity';
import { Salary, SalaryStatus } from '../entities/salary.entity';

@Injectable()
export class SalaryService {
  private readonly logger = new Logger(SalaryService.name);

  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Salary)
    private salaryRepository: Repository<Salary>,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  findAll(): Promise<Salary[]> {
    return this.salaryRepository.find({ relations: ['employee'] });
  }

  findByEmployee(employeeId: number): Promise<Salary[]> {
    return this.salaryRepository.find({
      where: { employee: { id: employeeId } },
      relations: ['employee'],
    });
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleMonthlySalaryGeneration() {
    this.logger.log('Starting monthly salary generation and payout...');
    const employees = await this.employeeRepository.find();
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    for (const employee of employees) {
      if (employee.baseSalary > 0) {
        await this.processSalary(employee, month, year);
      }
    }
    this.logger.log('Monthly salary generation and payout completed.');
  }

  async processSalary(employee: Employee, month: number, year: number) {
    // Check if salary already exists for this month/year
    const existing = await this.salaryRepository.findOne({
      where: {
        employee: { id: employee.id },
        month,
        year,
      },
    });

    if (existing && existing.status === SalaryStatus.PAID) {
      this.logger.warn(`Salary already paid for employee ${employee.id} for ${month}/${year}`);
      return;
    }

    const salary = existing || this.salaryRepository.create({
      employee,
      amount: employee.baseSalary,
      month,
      year,
      status: SalaryStatus.PENDING,
    });

    try {
      // Mock PayMob Payout
      const transactionId = await this.triggerPayMobPayout(employee, salary.amount);

      salary.status = SalaryStatus.PAID;
      salary.transactionId = transactionId;
      salary.paidAt = new Date();
      await this.salaryRepository.save(salary);

      await this.sendSalaryEmail(employee, salary);
      this.logger.log(`Successfully processed salary for employee ${employee.id}`);
    } catch (error) {
      salary.status = SalaryStatus.FAILED;
      await this.salaryRepository.save(salary);
      this.logger.error(`Failed to process salary for employee ${employee.id}: ${error.message}`);
    }
  }

  private async triggerPayMobPayout(employee: Employee, amount: number): Promise<string> {
    // In a real scenario, you would call PayMob's payout API here.
    // For now, we simulate a successful transaction.
    this.logger.log(`Triggering PayMob payout for ${employee.email} amount: ${amount}`);
    return `PAYMOB_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private async sendSalaryEmail(employee: Employee, salary: Salary) {
    try {
      await this.mailerService.sendMail({
        to: employee.email,
        subject: `Salary Slip - ${salary.month}/${salary.year}`,
        html: `
          <h1>Salary Slip</h1>
          <p>Dear ${employee.firstName} ${employee.lastName},</p>
          <p>Your salary for ${salary.month}/${salary.year} has been processed via PayMob.</p>
          <ul>
            <li><strong>Amount:</strong> ${salary.amount}</li>
            <li><strong>Status:</strong> ${salary.status}</li>
            <li><strong>Transaction ID:</strong> ${salary.transactionId}</li>
            <li><strong>Date:</strong> ${salary.paidAt.toLocaleDateString()}</li>
          </ul>
          <p>Thank you!</p>
        `,
      });
    } catch (error) {
      this.logger.error(`Failed to send salary email to ${employee.email}: ${error.message}`);
    }
  }
}
