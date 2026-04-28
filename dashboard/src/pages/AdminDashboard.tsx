import React from 'react';
import StatsCard from '../components/StatsCard';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400, tasks: 24 },
  { name: 'Feb', revenue: 3000, expenses: 1398, tasks: 13 },
  { name: 'Mar', revenue: 2000, expenses: 9800, tasks: 98 },
  { name: 'Apr', revenue: 2780, expenses: 3908, tasks: 39 },
  { name: 'May', revenue: 1890, expenses: 4800, tasks: 48 },
  { name: 'Jun', revenue: 2390, expenses: 3800, tasks: 38 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Admin Overview</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">System Health: Good</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value="156" icon={Users} trend="+12% from last month" color="bg-blue-500" />
        <StatsCard title="Total Revenue" value="$45,231" icon={TrendingUp} trend="+8% from last month" color="bg-emerald-500" />
        <StatsCard title="Active Projects" value="12" icon={Briefcase} trend="2 ending this week" color="bg-amber-500" />
        <StatsCard title="Pending Invoices" value="8" icon={FileText} trend="$2,400 overdue" color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#93c5fd" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#fca5a5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Module Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
