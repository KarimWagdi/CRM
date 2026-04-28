import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const leadService = {
  findAll: () => api.get('/leads'),
  findOne: (id: number) => api.get(`/leads/${id}`),
  create: (data: any) => api.post('/leads', data),
  update: (id: number, data: any) => api.patch(`/leads/${id}`, data),
  remove: (id: number) => api.delete(`/leads/${id}`),
};

export const accountService = {
  findAll: () => api.get('/accounts'),
  findOne: (id: number) => api.get(`/accounts/${id}`),
  create: (data: any) => api.post('/accounts', data),
  update: (id: number, data: any) => api.patch(`/accounts/${id}`, data),
  remove: (id: number) => api.delete(`/accounts/${id}`),
};

export const employeeService = {
  findAll: () => api.get('/employees'),
  findOne: (id: number) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: number, data: any) => api.patch(`/employees/${id}`, data),
  remove: (id: number) => api.delete(`/employees/${id}`),
};

export const projectService = {
  findAll: () => api.get('/projects'),
  findOne: (id: number) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: number, data: any) => api.patch(`/projects/${id}`, data),
  remove: (id: number) => api.delete(`/projects/${id}`),
};

export const invoiceService = {
  findAll: () => api.get('/invoices'),
  findOne: (id: number) => api.get(`/invoices/${id}`),
  create: (data: any) => api.post('/invoices', data),
  update: (id: number, data: any) => api.patch(`/invoices/${id}`, data),
  remove: (id: number) => api.delete(`/invoices/${id}`),
};

export const userService = {
  findAll: () => api.get('/users'),
  findOne: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.patch(`/users/${id}`, data),
  remove: (id: number) => api.delete(`/users/${id}`),
};

export const salaryService = {
  findAll: () => api.get('/salaries'),
  findByEmployee: (employeeId: number) => api.get(`/salaries/employee/${employeeId}`),
  triggerMonthly: () => api.post('/salaries/trigger-monthly'),
};

export const performanceService = {
  findAll: () => api.get('/performance'),
  findByEmployee: (employeeId: number) => api.get(`/performance/employee/${employeeId}`),
  create: (data: any) => api.post('/performance', data),
  calculateMetrics: (employeeId: number, startDate: string, endDate: string) =>
    api.get(`/performance/calculate-metrics/${employeeId}`, { params: { startDate, endDate } }),
};

export default api;
