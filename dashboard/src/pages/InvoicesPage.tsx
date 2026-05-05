import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { invoiceService, accountService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    accountId: '',
    totalAmount: 0,
    issueDate: '',
    dueDate: '',
    status: 'Draft',
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await invoiceService.findAll();
      setInvoices(res.data);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await accountService.findAll();
      setAccounts(res.data);
    } catch (error) {
      console.error('Failed to fetch accounts', error);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await invoiceService.create({
        ...formData,
        accountId: Number(formData.accountId),
        totalAmount: Number(formData.totalAmount),
      });
      setIsModalOpen(false);
      setFormData({
        invoiceNumber: '',
        accountId: '',
        totalAmount: 0,
        issueDate: '',
        dueDate: '',
        status: 'Draft',
      });
      fetchInvoices();
    } catch (error) {
      console.error('Failed to create invoice', error);
    }
  };

  const columns = [
    { header: 'Invoice #', accessor: 'invoiceNumber' },
    { header: 'Account', accessor: (i: any) => i.account?.name || 'N/A' },
    { header: 'Amount', accessor: (i: any) => `$${parseFloat(i.totalAmount).toLocaleString()}` },
    {
      header: 'Status',
      accessor: (i: any) => <StatusBadge label={i.status} type={i.status === 'Paid' ? 'success' : i.status === 'Overdue' ? 'error' : 'warning'} />
    },
    { header: 'Issue Date', accessor: (i: any) => new Date(i.issueDate).toLocaleDateString() },
    { header: 'Due Date', accessor: (i: any) => new Date(i.dueDate).toLocaleDateString() },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Invoices...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Invoices Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create Invoice
        </button>
      </div>
      <DataTable title="All Invoices" columns={columns as any} data={invoices} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Invoice"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Number</label>
              <input
                type="text"
                required
                placeholder="INV-2024-001"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account</label>
              <select
                required
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">Select account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount ($)</label>
            <input
              type="number"
              required
              step="0.01"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
              <input
                type="date"
                required
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
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
              Create Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InvoicesPage;
