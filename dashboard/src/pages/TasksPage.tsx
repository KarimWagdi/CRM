import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { taskService, employeeService } from '../services/api';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    listId: '',
    assigneeId: '',
    dueDate: '',
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await taskService.findAll();
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [listRes, empRes] = await Promise.all([
        taskService.getLists(),
        employeeService.findAll(),
      ]);
      setLists(listRes.data);
      setEmployees(empRes.data);
    } catch (error) {
      console.error('Failed to fetch metadata', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchMetadata();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskService.create({
        ...formData,
        listId: Number(formData.listId),
        assigneeId: formData.assigneeId ? Number(formData.assigneeId) : undefined,
      });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', listId: '', assigneeId: '', dueDate: '' });
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

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
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>
      <DataTable title="All Tasks" columns={columns as any} data={tasks} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">List</label>
              <select
                required
                value={formData.listId}
                onChange={(e) => setFormData({ ...formData, listId: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">Select a list</option>
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
            <select
              value={formData.assigneeId}
              onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">Unassigned</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TasksPage;
