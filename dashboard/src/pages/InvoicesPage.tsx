import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { invoiceService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await invoiceService.findAll();
        setInvoices(res.data);
      } catch (error) {
        console.error('Failed to fetch invoices', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

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
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          Create Invoice
        </button>
      </div>
      <DataTable title="All Invoices" columns={columns as any} data={invoices} />
    </div>
  );
};

export default InvoicesPage;
