import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
};

export const leadService = {
  findAll: () => api.get('/leads'),
  findOne: (id: number) => api.get(`/leads/${id}`),
  create: (data: any) => api.post('/leads', data),
  update: (id: number, data: any) => api.patch(`/leads/${id}`, data),
  remove: (id: number) => api.delete(`/leads/${id}`),
  getStats: () => api.get('/leads/stats'),
};

export const opportunityService = {
  findAll: () => api.get('/opportunities'),
  findOne: (id: number) => api.get(`/opportunities/${id}`),
  create: (data: any) => api.post('/opportunities', data),
  update: (id: number, data: any) => api.patch(`/opportunities/${id}`, data),
  remove: (id: number) => api.delete(`/opportunities/${id}`),
  getStats: () => api.get('/opportunities/stats'),
};

export const accountService = {
  findAll: () => api.get('/accounts'),
  findOne: (id: number) => api.get(`/accounts/${id}`),
  create: (data: any) => api.post('/accounts', data),
  update: (id: number, data: any) => api.patch(`/accounts/${id}`, data),
  remove: (id: number) => api.delete(`/accounts/${id}`),
  getStats: () => api.get('/accounts/stats'),
};

export const employeeService = {
  findAll: () => api.get('/employees'),
  findOne: (id: number) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: number, data: any) => api.patch(`/employees/${id}`, data),
  remove: (id: number) => api.delete(`/employees/${id}`),
  getStats: () => api.get('/employees/stats'),
};

export const attendanceService = {
  findAll: () => api.get('/attendance'),
  getStats: () => api.get('/attendance/stats'),
};

export const projectService = {
  findAll: () => api.get('/projects'),
  findOne: (id: number) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: number, data: any) => api.patch(`/projects/${id}`, data),
  remove: (id: number) => api.delete(`/projects/${id}`),
  getStats: () => api.get('/projects/stats'),
};

export const taskService = {
  findAll: () => api.get('/tasks'),
  findOne: (id: number) => api.get(`/tasks/${id}`),
  create: (data: any) => api.post('/tasks', data),
  update: (id: number, data: any) => api.patch(`/tasks/${id}`, data),
  remove: (id: number) => api.delete(`/tasks/${id}`),
  getStats: () => api.get('/tasks/stats'),
};

export const invoiceService = {
  findAll: () => api.get('/invoices'),
  findOne: (id: number) => api.get(`/invoices/${id}`),
  create: (data: any) => api.post('/invoices', data),
  update: (id: number, data: any) => api.patch(`/invoices/${id}`, data),
  remove: (id: number) => api.delete(`/invoices/${id}`),
  getStats: () => api.get('/invoices/stats'),
};

export const expenseService = {
  findAll: () => api.get('/expenses'),
  getStats: () => api.get('/expenses/stats'),
};

export const supplierService = {
  findAll: () => api.get('/suppliers'),
  findOne: (id: number) => api.get(`/suppliers/${id}`),
  create: (data: any) => api.post('/suppliers', data),
  update: (id: number, data: any) => api.patch(`/suppliers/${id}`, data),
  remove: (id: number) => api.delete(`/suppliers/${id}`),
};

export const billService = {
  findAll: () => api.get('/bills'),
  findOne: (id: number) => api.get(`/bills/${id}`),
  create: (data: any) => api.post('/bills', data),
  update: (id: number, data: any) => api.patch(`/bills/${id}`, data),
  remove: (id: number) => api.delete(`/bills/${id}`),
  getStats: () => api.get('/bills/stats'),
};

export const inventoryService = {
  findAll: () => api.get('/inventory'),
  findOne: (id: number) => api.get(`/inventory/${id}`),
  create: (data: any) => api.post('/inventory', data),
  update: (id: number, data: any) => api.patch(`/inventory/${id}`, data),
  remove: (id: number) => api.delete(`/inventory/${id}`),
  getStats: () => api.get('/inventory/stats'),
  purchase: (id: number, data: any) => api.post(`/inventory/${id}/purchase`, data),
};

export const paymentService = {
  findAll: () => api.get('/payments'),
};

export const leaveRequestService = {
  findAll: () => api.get('/leave-requests'),
  getStats: () => api.get('/leave-requests/stats'),
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
