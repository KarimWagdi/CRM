import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { userService, projectService, invoiceService, taskService } from '../services/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [userRes, projRes, invRes, taskRes] = await Promise.all([
          userService.findAll(),
          projectService.getStats(),
          invoiceService.getStats(),
          taskService.getStats()
        ]);
        setStats({
          users: userRes.data.length,
          projects: projRes.data.totalCount,
          revenue: invRes.data.totalAmount,
          invoices: invRes.data.statusCounts.find((s:any) => s.status === 'Sent')?.count || 0,
          tasks: taskRes.data.totalCount
        });
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Admin Dashboard...</div>;

  const data = [
    { name: 'Total', revenue: stats.revenue, tasks: stats.tasks },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Admin Overview</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">System Health: Good</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={stats.users} icon={Users} trend="Live from system" color="bg-blue-500" />
        <StatsCard title="Total Revenue" value={`$${stats.revenue?.toLocaleString() || 0}`} icon={TrendingUp} trend="Gross invoiced" color="bg-emerald-500" />
        <StatsCard title="Active Projects" value={stats.projects} icon={Briefcase} trend="Current tracked" color="bg-amber-500" />
        <StatsCard title="Pending Invoices" value={stats.invoices} icon={FileText} trend="Awaiting payment" color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">System Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#93c5fd" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Task Volume</h3>
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
