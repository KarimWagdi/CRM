import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { opportunityService, accountService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const OpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    accountId: '',
    closeDate: '',
    stage: 'Prospecting',
  });

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await opportunityService.findAll();
      setOpportunities(res.data);
    } catch (error) {
      console.error('Failed to fetch opportunities', error);
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
    fetchOpportunities();
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await opportunityService.create({
        ...formData,
        amount: Number(formData.amount),
        accountId: Number(formData.accountId),
      });
      setIsModalOpen(false);
      setFormData({ name: '', amount: 0, accountId: '', closeDate: '', stage: 'Prospecting' });
      fetchOpportunities();
    } catch (error) {
      console.error('Failed to create opportunity', error);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Account', accessor: (o: any) => o.account?.name || 'N/A' },
    { header: 'Amount', accessor: (o: any) => `$${parseFloat(o.amount).toLocaleString()}` },
    {
      header: 'Stage',
      accessor: (o: any) => <StatusBadge label={o.stage} type={o.stage === 'Closed Won' ? 'success' : o.stage === 'Closed Lost' ? 'error' : 'info'} />
    },
    { header: 'Close Date', accessor: (o: any) => o.closeDate ? new Date(o.closeDate).toLocaleDateString() : '-' },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Opportunities...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Opportunities Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Opportunity
        </button>
      </div>
      <DataTable title="All Opportunities" columns={columns as any} data={opportunities} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Opportunity"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Opportunity Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Close Date</label>
              <input
                type="date"
                required
                value={formData.closeDate}
                onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account</label>
            <select
              required
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">Select an account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
            <select
              required
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Prospecting">Prospecting</option>
              <option value="Qualification">Qualification</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
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
              Create Opportunity
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OpportunitiesPage;
