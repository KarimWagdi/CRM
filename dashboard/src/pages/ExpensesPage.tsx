import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { expenseService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await expenseService.findAll();
        setExpenses(res.data);
      } catch (error) {
        console.error('Failed to fetch expenses', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

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
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          Log Expense
        </button>
      </div>
      <DataTable title="All Expenses" columns={columns as any} data={expenses} />
    </div>
  );
};

export default ExpensesPage;
