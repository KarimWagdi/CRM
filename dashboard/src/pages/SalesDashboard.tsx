import React from 'react';
import StatsCard from '../components/StatsCard';
import { TrendingUp, UserPlus, Target, PhoneCall } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const pipelineData = [
  { name: 'Prospecting', value: 40 },
  { name: 'Proposal', value: 30 },
  { name: 'Negotiation', value: 20 },
  { name: 'Closed Won', value: 10 },
];

const COLORS = ['#94a3b8', '#60a5fa', '#8b5cf6', '#10b981'];

const SalesDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Sales Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="New Leads" value="24" icon={UserPlus} trend="+5 today" color="bg-blue-500" />
        <StatsCard title="Open Opps" value="18" icon={Target} trend="$124,000 value" color="bg-indigo-500" />
        <StatsCard title="Conversion Rate" value="3.2%" icon={TrendingUp} trend="+0.4% this week" color="bg-emerald-500" />
        <StatsCard title="Calls Today" value="12" icon={PhoneCall} trend="Target: 20" color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Opportunity Pipeline</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pipelineData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Leads</h3>
          <div className="space-y-4">
            {[
              { name: 'John Doe', company: 'Acme Corp', status: 'Qualified' },
              { name: 'Jane Smith', company: 'Global Tech', status: 'New' },
              { name: 'Bob Wilson', company: 'Soft Systems', status: 'Contacted' },
              { name: 'Alice Brown', company: 'Fast Retail', status: 'Proposal' },
            ].map((lead, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{lead.name}</p>
                  <p className="text-xs text-slate-500">{lead.company}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
