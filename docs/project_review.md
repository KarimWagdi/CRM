# Project Review: CRM & HR System

## 1. Overview
This project is a comprehensive CRM and HR management system with integrated task management and accounting modules. It utilizes a modern tech stack with a NestJS backend and a React (Vite) frontend.

## 2. Tech Stack
- **Backend:**
  - Framework: NestJS
  - ORM: TypeORM
  - Database: MySQL (mysql2 driver)
  - API Documentation: Swagger (@nestjs/swagger)
  - Features: @nestjs/schedule (Crons), @nestjs-modules/mailer (Email notifications)
  - Validation: class-validator, ValidationPipe
- **Frontend:**
  - Framework: React with Vite
  - Styling: Tailwind CSS
  - Icons: Lucide React
  - Charts: Recharts
  - API Client: Axios

## 3. Module Architecture (Refactored)
The backend has been refactored to a modular structure under `src/modules/`:
- **AccountingModule:** Invoices, Invoice Items, Payments, and Expenses.
- **CrmModule:** Manages Leads, Accounts, Contacts, Opportunities, and Activities.
- **HrModule:** Handles Employees, Departments, Positions, Leave Requests, Attendance, Salaries, and Performance Reviews.
- **TasksModule:** Project management with Boards, Lists, and Tasks.
- **UsersModule:** User management and Role-based access control (RBAC).
- **AuthModule:** Authentication logic (Mock implementation with Login).

## 4. Key Implementation Highlights
- **Integrated Identity:** Every `Employee` is linked to a `User` which has a `Role`.
- **RBAC Foundation:** Implemented `RolesGuard` and `Roles` decorator to support role-based API access.
- **Interconnected Data Model:** Strong relationships between modules (e.g., Tasks/Expenses linked to Employees; Projects/Invoices linked to CRM Accounts).
- **Automated Salary Processing:** `SalaryService` includes a monthly cron job that simulates payouts via PayMob and sends email slips to employees.
- **Performance Metrics:** Logic in `PerformanceService` to calculate employee efficiency using Task and Attendance data.

## 5. Current Gaps and Areas for Improvement
- **Testing:** Critical deficiency in test coverage. Only one boilerplate test exists.
- **Frontend Maturity:** Most management views (Leads, Tasks, Invoices, etc.) are currently placeholders.
- **Authentication:** A basic `AuthModule` and `AuthController` have been added, but a full JWT/Passport implementation is still needed for secure production use.
- **Data Integrity:** Inconsistent use of TypeORM column types (e.g., `simple-enum` vs `enum`).

## 6. Future Recommendations
1. Fully implement JWT-based authentication.
2. Apply `RolesGuard` to sensitive endpoints.
3. Build out the placeholder frontend pages to make the system fully functional.
4. Establish a comprehensive test suite.
