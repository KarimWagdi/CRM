# Database Schema Design

## CRM System

### Entities

1.  **Account**
    *   `id`: Primary Key
    *   `name`: string
    *   `industry`: string
    *   `website`: string
    *   `phone`: string
    *   `address`: string
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp

2.  **Contact**
    *   `id`: Primary Key
    *   `firstName`: string
    *   `lastName`: string
    *   `email`: string
    *   `phone`: string
    *   `accountId`: Foreign Key (Account)
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp

3.  **Lead**
    *   `id`: Primary Key
    *   `firstName`: string
    *   `lastName`: string
    *   `email`: string
    *   `company`: string
    *   `status`: enum (New, Contacted, Qualified, Lost)
    *   `source`: string
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp

4.  **Opportunity**
    *   `id`: Primary Key
    *   `name`: string
    *   `amount`: decimal
    *   `stage`: enum (Prospecting, Qualification, Proposal, Negotiation, Closed Won, Closed Lost)
    *   `closeDate`: date
    *   `accountId`: Foreign Key (Account)
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp

5.  **Activity**
    *   `id`: Primary Key
    *   `type`: enum (Call, Email, Meeting, Task)
    *   `subject`: string
    *   `description`: text
    *   `dueDate`: timestamp
    *   `contactId`: Foreign Key (Contact) - optional
    *   `opportunityId`: Foreign Key (Opportunity) - optional
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp

## HR System

### Entities

1.  **Employee**
    *   `id`: Primary Key
    *   `firstName`: string
    *   `lastName`: string
    *   `email`: string
    *   `phone`: string
    *   `hireDate`: date
    *   `departmentId`: Foreign Key (Department)
    *   `positionId`: Foreign Key (Position)
    *   `userId`: Foreign Key (User) - optional
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp

2.  **Department**
    *   `id`: Primary Key
    *   `name`: string
    *   `description`: text
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp

3.  **Position**
    *   `id`: Primary Key
    *   `title`: string
    *   `description`: text
    *   `salaryRange`: string
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp

4.  **LeaveRequest**
    *   `id`: Primary Key
    *   `employeeId`: Foreign Key (Employee)
    *   `startDate`: date
    *   `endDate`: date
    *   `type`: enum (Sick, Vacation, Personal)
    *   `status`: enum (Pending, Approved, Rejected)
    *   `reason`: text
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp

5.  **Attendance**
    *   `id`: Primary Key
    *   `employeeId`: Foreign Key (Employee)
    *   `date`: date
    *   `checkIn`: timestamp
    *   `checkOut`: timestamp
    *   `status`: enum (Present, Absent, Late)
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp

## User & Auth System

### Entities

1.  **User**
    *   `id`: Primary Key
    *   `username`: string
    *   `password`: string
    *   `email`: string
    *   `roleId`: Foreign Key (Role)
    *   `isActive`: boolean
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp

2.  **Role**
    *   `id`: Primary Key
    *   `name`: string
    *   `description`: string
    *   `permissions`: json
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp
