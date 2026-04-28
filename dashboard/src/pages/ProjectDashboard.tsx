import React from 'react';
import StatsCard from '../components/StatsCard';
import { Briefcase, CheckSquare, Clock, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const progressData = [
  { name: 'Week 1', completed: 12, total: 20 },
  { name: 'Week 2', completed: 18, total: 25 },
  { name: 'Week 3', completed: 15, total: 22 },
  { name: 'Week 4', completed: 22, total: 30 },
];

const ProjectDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Project Operations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Projects" value="8" icon={Briefcase} trend="3 on track, 1 delayed" color="bg-blue-500" />
        <StatsCard title="Tasks Completed" value="42" icon={CheckSquare} trend="+12 since yesterday" color="bg-emerald-500" />
        <StatsCard title="Total Hours" value="320" icon={Clock} trend="This sprint" color="bg-amber-500" />
        <StatsCard title="Team Members" value="18" icon={Users} trend="Across all boards" color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Task Completion Rate</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="total" stroke="#94a3b8" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Active Boards</h3>
          <div className="space-y-4">
            {[
              { name: 'Q4 Product Launch', progress: 75, members: 8 },
              { name: 'Website Redesign', progress: 40, members: 4 },
              { name: 'API Migration', progress: 90, members: 3 },
              { name: 'CRM Integration', progress: 20, members: 6 },
            ].map((project, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">{project.name}</span>
                  <span className="text-slate-500">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
