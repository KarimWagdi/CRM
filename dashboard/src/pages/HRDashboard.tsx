import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { Users, Calendar, Clock, Award, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { salaryService, performanceService } from '../services/api';

const attendanceData = [
  { name: 'Mon', present: 95, absent: 5 },
  { name: 'Tue', present: 92, absent: 8 },
  { name: 'Wed', present: 98, absent: 2 },
  { name: 'Thu', present: 94, absent: 6 },
  { name: 'Fri', present: 90, absent: 10 },
];

const HRDashboard: React.FC = () => {
  const [salaries, setSalaries] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salRes, revRes] = await Promise.all([
          salaryService.findAll(),
          performanceService.findAll()
        ]);
        setSalaries(salRes.data);
        setReviews(revRes.data);
      } catch (error) {
        console.error("Failed to fetch HR data", error);
      } finally {
        setLoading(loading => false);
      }
    };
    fetchData();
  }, []);

  const handleRunPayout = async () => {
    if (window.confirm("Are you sure you want to run monthly payouts for all employees?")) {
      try {
        await salaryService.triggerMonthly();
        alert("Payout process triggered successfully!");
        const salRes = await salaryService.findAll();
        setSalaries(salRes.data);
      } catch (error) {
        alert("Failed to trigger payout");
      }
    }
  };

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Weekly Attendance</h3>
          </div>
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

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Salaries & Payouts</h3>
            <button
              onClick={handleRunPayout}
              className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-700"
            >
              Run Monthly Payout
            </button>
          </div>
          <div className="space-y-4">
            {loading ? <p className="text-sm text-slate-500">Loading...</p> :
             salaries.length === 0 ? <p className="text-sm text-slate-500">No salary records found.</p> :
             salaries.slice(0, 5).map((sal, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{sal.employee?.firstName} {sal.employee?.lastName}</p>
                  <p className="text-xs text-slate-500">${sal.amount} • {sal.month}/{sal.year}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${sal.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {sal.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Performance Reviews</h3>
            <button className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-700">
              New Review
            </button>
          </div>
          <div className="space-y-4">
            {loading ? <p className="text-sm text-slate-500">Loading...</p> :
             reviews.length === 0 ? <p className="text-sm text-slate-500">No reviews found.</p> :
             reviews.slice(0, 5).map((rev, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{rev.employee?.firstName} {rev.employee?.lastName}</p>
                  <p className="text-xs text-slate-500">{rev.period}</p>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-sm font-bold text-slate-700">{rev.score}/5.0</span>
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
