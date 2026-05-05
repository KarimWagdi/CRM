import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { paymentService, invoiceService } from '../services/api';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer',
    reference: '',
    invoiceId: '',
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.findAll();
      setPayments(res.data);
    } catch (error) {
      console.error('Failed to fetch payments', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await invoiceService.findAll();
      setInvoices(res.data);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchInvoices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await paymentService.create({
        ...formData,
        amount: Number(formData.amount),
        invoiceId: formData.invoiceId ? Number(formData.invoiceId) : undefined,
      });
      setIsModalOpen(false);
      setFormData({
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        reference: '',
        invoiceId: '',
      });
      fetchPayments();
    } catch (error) {
      console.error('Failed to create payment', error);
    }
  };

  const columns = [
    { header: 'Payment Date', accessor: (p: any) => new Date(p.paymentDate).toLocaleDateString() },
    { header: 'Amount', accessor: (p: any) => `$${parseFloat(p.amount).toLocaleString()}` },
    { header: 'Method', accessor: 'paymentMethod' },
    { header: 'Reference', accessor: 'reference' },
    { header: 'Created At', accessor: (p: any) => new Date(p.createdAt).toLocaleDateString() },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Payments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Payments History</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Record Payment
        </button>
      </div>
      <DataTable title="All Payments" columns={columns as any} data={payments} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Payment"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment Date</label>
              <input
                type="date"
                required
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Invoice (Optional)</label>
            <select
              value={formData.invoiceId}
              onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">No Invoice / General Payment</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>{inv.invoiceNumber} - {inv.account?.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
            <select
              required
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Check">Check</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reference / Note</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
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
              Record Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentsPage;
