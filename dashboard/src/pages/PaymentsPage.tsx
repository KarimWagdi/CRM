import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { paymentService } from '../services/api';

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await paymentService.findAll();
        setPayments(res.data);
      } catch (error) {
        console.error('Failed to fetch payments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

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
      </div>
      <DataTable title="All Payments" columns={columns as any} data={payments} />
    </div>
  );
};

export default PaymentsPage;
