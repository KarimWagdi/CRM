import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { TrendingUp, UserPlus, Target, PhoneCall } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { leadService, opportunityService } from '../services/api';

const COLORS = ['#94a3b8', '#60a5fa', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const SalesDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [oppStats, setOppStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [leadRes, oppRes] = await Promise.all([
          leadService.getStats(),
          opportunityService.getStats(),
        ]);
        setStats(leadRes.data);
        setOppStats(oppRes.data);
      } catch (error) {
        console.error('Failed to fetch sales stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Sales Dashboard...</div>;

  const pipelineData = oppStats?.stageCounts.map((item: any) => ({
    name: item.stage,
    value: parseInt(item.count),
  })) || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Sales Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Leads" value={stats?.total || 0} icon={UserPlus} trend="Lifetime total" color="bg-blue-500" />
        <StatsCard title="Open Opps" value={oppStats?.total || 0} icon={Target} trend={`$${oppStats?.totalValue?.toLocaleString() || 0} value`} color="bg-indigo-500" />
        <StatsCard title="Conversion Rate" value="TBD" icon={TrendingUp} trend="Active analysis" color="bg-emerald-500" />
        <StatsCard title="Lead Growth" value={stats?.recentLeads.length || 0} icon={PhoneCall} trend="New this period" color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Opportunity Pipeline</h3>
          <div className="h-[300px]">
            {pipelineData.length > 0 ? (
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
                    {pipelineData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No pipeline data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Leads</h3>
          <div className="space-y-4">
            {stats?.recentLeads.length > 0 ? stats.recentLeads.map((lead: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{lead.firstName} {lead.lastName}</p>
                  <p className="text-xs text-slate-500">{lead.company || 'N/A'}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                  {lead.status}
                </span>
              </div>
            )) : (
              <p className="text-slate-400 text-sm">No recent leads found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
