import React from 'react';
import StatsCard from '../components/StatsCard';
import { FileText, CreditCard, TrendingDown, Landmark } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const financeData = [
  { name: 'Aug', revenue: 32000, expenses: 28000 },
  { name: 'Sep', revenue: 45000, expenses: 31000 },
  { name: 'Oct', revenue: 38000, expenses: 29000 },
];

const FinanceDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Financial Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Revenue" value="$115k" icon={Landmark} trend="+15% vs Q3" color="bg-emerald-500" />
        <StatsCard title="Outstanding Invoices" value="14" icon={FileText} trend="$24,500 total" color="bg-rose-500" />
        <StatsCard title="Expenses" value="$88k" icon={TrendingDown} trend="On budget" color="bg-amber-500" />
        <StatsCard title="Recent Payments" value="32" icon={CreditCard} trend="Last 30 days" color="bg-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Cash Flow</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
                {[
                  { id: 'INV-001', client: 'Acme Corp', amount: '$4,200', status: 'Paid' },
                  { id: 'INV-002', client: 'Global Tech', amount: '$1,800', status: 'Sent' },
                  { id: 'INV-003', client: 'Fast Retail', amount: '$2,500', status: 'Overdue' },
                  { id: 'INV-004', client: 'Soft Systems', amount: '$3,100', status: 'Draft' },
                ].map((inv) => (
                  <tr key={inv.id} className="text-sm">
                    <td className="py-4 font-medium text-slate-900">{inv.id}</td>
                    <td className="py-4 text-slate-600">{inv.client}</td>
                    <td className="py-4 text-slate-900 font-semibold">{inv.amount}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
