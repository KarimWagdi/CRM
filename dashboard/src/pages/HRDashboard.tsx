import React from 'react';
import StatsCard from '../components/StatsCard';
import { Users, Calendar, Clock, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const attendanceData = [
  { name: 'Mon', present: 95, absent: 5 },
  { name: 'Tue', present: 92, absent: 8 },
  { name: 'Wed', present: 98, absent: 2 },
  { name: 'Thu', present: 94, absent: 6 },
  { name: 'Fri', present: 90, absent: 10 },
];

const HRDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">HR Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Employees" value="142" icon={Users} trend="2 new hires this month" color="bg-blue-500" />
        <StatsCard title="Leave Requests" value="5" icon={Calendar} trend="Pending approval" color="bg-amber-500" />
        <StatsCard title="Attendance" value="94%" icon={Clock} trend="Today's rate" color="bg-emerald-500" />
        <StatsCard title="Open Positions" value="3" icon={Award} trend="Engineering, Sales" color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Weekly Attendance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar dataKey="present" fill="#10b981" stackId="a" />
                <Bar dataKey="absent" fill="#ef4444" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Pending Leave Requests</h3>
          <div className="space-y-4">
            {[
              { name: 'Sarah Miller', type: 'Vacation', date: 'Oct 12 - Oct 15' },
              { name: 'James Wilson', type: 'Sick Leave', date: 'Oct 10' },
              { name: 'Emily Davis', type: 'Personal', date: 'Oct 20' },
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{req.name}</p>
                  <p className="text-xs text-slate-500">{req.type} • {req.date}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">APPROVE</button>
                  <button className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded">REJECT</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
