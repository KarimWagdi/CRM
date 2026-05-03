import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { FileText, CreditCard, TrendingDown, Landmark } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { invoiceService, expenseService } from '../services/api';

const FinanceDashboard: React.FC = () => {
  const [invoiceStats, setInvoiceStats] = useState<any>(null);
  const [expenseStats, setExpenseStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, expRes] = await Promise.all([
          invoiceService.getStats(),
          expenseService.getStats()
        ]);
        setInvoiceStats(invRes.data);
        setExpenseStats(expRes.data);
      } catch (error) {
        console.error('Failed to fetch financial data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Finance Dashboard...</div>;

  const chartData = expenseStats?.categoryCounts.map((cat: any) => ({
    name: cat.category,
    amount: parseFloat(cat.total)
  })) || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Financial Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Invoiced" value={`$${invoiceStats?.totalAmount?.toLocaleString() || 0}`} icon={Landmark} trend={`${invoiceStats?.totalCount || 0} invoices`} color="bg-emerald-500" />
        <StatsCard title="Outstanding" value={invoiceStats?.statusCounts.find((s:any) => s.status === 'Sent')?.count || 0} icon={FileText} trend="Awaiting payment" color="bg-rose-500" />
        <StatsCard title="Total Expenses" value={`$${expenseStats?.totalAmount?.toLocaleString() || 0}`} icon={TrendingDown} trend="Lifetime" color="bg-amber-500" />
        <StatsCard title="Paid Invoices" value={invoiceStats?.statusCounts.find((s:any) => s.status === 'Paid')?.count || 0} icon={CreditCard} trend="Successfully collected" color="bg-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No expense data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3">Invoice #</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoiceStats?.recentInvoices.length > 0 ? invoiceStats.recentInvoices.map((inv: any) => (
                  <tr key={inv.id} className="text-sm">
                    <td className="py-4 font-medium text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-4 text-slate-600">{inv.account?.name || 'N/A'}</td>
                    <td className="py-4 text-slate-900 font-semibold">${parseFloat(inv.totalAmount).toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                        inv.status === 'Overdue' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400">No recent invoices found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
