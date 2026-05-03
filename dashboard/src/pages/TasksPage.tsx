import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { taskService } from '../services/api';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await taskService.findAll();
        setTasks(res.data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
    { header: 'List', accessor: (t: any) => t.list?.name || 'N/A' },
    {
      header: 'Assignee',
      accessor: (t: any) => t.assignee ? `${t.assignee.firstName} ${t.assignee.lastName}` : 'Unassigned'
    },
    { header: 'Due Date', accessor: (t: any) => t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-' },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Tasks...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Tasks Management</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          New Task
        </button>
      </div>
      <DataTable title="All Tasks" columns={columns as any} data={tasks} />
    </div>
  );
};

export default TasksPage;
