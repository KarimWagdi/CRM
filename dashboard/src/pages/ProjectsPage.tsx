import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { projectService, accountService } from '../services/api';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accountId: '',
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await projectService.findAll();
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await accountService.findAll();
      setAccounts(res.data);
    } catch (error) {
      console.error('Failed to fetch accounts', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectService.create({
        ...formData,
        accountId: formData.accountId ? Number(formData.accountId) : undefined,
      });
      setIsModalOpen(false);
      setFormData({ name: '', description: '', accountId: '' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Account', accessor: (p: any) => p.account?.name || 'Internal' },
    { header: 'Created At', accessor: (p: any) => new Date(p.createdAt).toLocaleDateString() },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Projects Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>
      <DataTable title="All Projects" columns={columns as any} data={projects} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Project"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account (Optional)</label>
            <select
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">Internal / No Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
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
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
