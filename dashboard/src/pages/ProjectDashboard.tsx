import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { Briefcase, CheckSquare, Clock, Users } from 'lucide-react';
import { projectService, taskService } from '../services/api';

const ProjectDashboard: React.FC = () => {
  const [projectStats, setProjectStats] = useState<any>(null);
  const [taskStats, setTaskStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          projectService.getStats(),
          taskService.getStats()
        ]);
        setProjectStats(projRes.data);
        setTaskStats(taskRes.data);
      } catch (error) {
        console.error('Failed to fetch project data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Project Dashboard...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Project Operations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Projects" value={projectStats?.totalCount || 0} icon={Briefcase} trend="Total projects" color="bg-blue-500" />
        <StatsCard title="Tasks Completed" value={taskStats?.completedCount || 0} icon={CheckSquare} trend={`Out of ${taskStats?.totalCount || 0}`} color="bg-emerald-500" />
        <StatsCard title="Completion Rate" value={taskStats?.totalCount > 0 ? `${Math.round((taskStats.completedCount / taskStats.totalCount) * 100)}%` : '0%'} icon={Clock} trend="Task efficiency" color="bg-amber-500" />
        <StatsCard title="Newest Projects" value={projectStats?.recentProjects.length || 0} icon={Users} trend="Recently added" color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
          <div className="space-y-4">
            {projectStats?.recentProjects.length > 0 ? projectStats.recentProjects.map((project: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">{project.name}</span>
                  <span className="text-slate-500">{project.account?.name || 'Internal'}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `100%` }}
                  ></div>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm text-center">No projects found.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Latest Tasks</h3>
          <div className="space-y-4">
            {taskStats?.recentTasks.length > 0 ? taskStats.recentTasks.map((task: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.list?.name} • {task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned'}</p>
                </div>
                {task.dueDate && (
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(task.dueDate).toLocaleDateString()}</span>
                )}
              </div>
            )) : (
              <p className="text-slate-400 text-sm text-center">No tasks found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
