import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { leaveRequestService, employeeService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const LeaveRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    type: 'Personal',
    reason: '',
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await leaveRequestService.findAll();
      setRequests(res.data);
    } catch (error) {
      console.error('Failed to fetch leave requests', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.findAll();
      setEmployees(res.data);
    } catch (error) {
      console.error('Failed to fetch employees', error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await leaveRequestService.create({
        ...formData,
        employeeId: Number(formData.employeeId),
      });
      setIsModalOpen(false);
      setFormData({ employeeId: '', startDate: '', endDate: '', type: 'Personal', reason: '' });
      fetchRequests();
    } catch (error) {
      console.error('Failed to create leave request', error);
    }
  };

  const columns = [
    { header: 'Employee', accessor: (r: any) => r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : 'N/A' },
    { header: 'Type', accessor: 'type' },
    { header: 'Start Date', accessor: (r: any) => new Date(r.startDate).toLocaleDateString() },
    { header: 'End Date', accessor: (r: any) => new Date(r.endDate).toLocaleDateString() },
    {
      header: 'Status',
      accessor: (r: any) => <StatusBadge label={r.status} type={r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'error' : 'warning'} />
    },
    { header: 'Reason', accessor: 'reason' },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Leave Requests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Leave Requests</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Request
        </button>
      </div>
      <DataTable title="All Requests" columns={columns as any} data={requests} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Leave Request"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">Select an employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Personal">Personal</option>
              <option value="Sick">Sick</option>
              <option value="Vacation">Vacation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              rows={3}
            />
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
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeaveRequestsPage;
