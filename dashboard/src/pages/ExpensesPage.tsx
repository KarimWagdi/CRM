import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { expenseService, employeeService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: 0,
    category: '',
    expenseDate: '',
    employeeId: '',
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await expenseService.findAll();
      setExpenses(res.data);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.findAll();
      setEmployees(res.data);
    } catch (error) {
      console.error('Failed to fetch employees', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await expenseService.create({
        ...formData,
        amount: Number(formData.amount),
        employeeId: Number(formData.employeeId),
      });
      setIsModalOpen(false);
      setFormData({
        description: '',
        amount: 0,
        category: '',
        expenseDate: '',
        employeeId: '',
      });
      fetchExpenses();
    } catch (error) {
      console.error('Failed to create expense', error);
    }
  };

  const columns = [
    { header: 'Description', accessor: 'description' },
    { header: 'Amount', accessor: (e: any) => `$${parseFloat(e.amount).toLocaleString()}` },
    { header: 'Category', accessor: 'category' },
    { header: 'Employee', accessor: (e: any) => e.employee ? `${e.employee.firstName} ${e.employee.lastName}` : 'N/A' },
    {
      header: 'Status',
      accessor: (e: any) => <StatusBadge label={e.status} type={e.status === 'Approved' ? 'success' : e.status === 'Rejected' ? 'error' : 'warning'} />
    },
    { header: 'Date', accessor: (e: any) => new Date(e.expenseDate).toLocaleDateString() },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Expenses...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Expenses Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Log Expense
        </button>
      </div>
      <DataTable title="All Expenses" columns={columns as any} data={expenses} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log New Expense"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.expenseDate}
                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input
              type="text"
              required
              placeholder="e.g. Travel, Office Supplies"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Log Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExpensesPage;
