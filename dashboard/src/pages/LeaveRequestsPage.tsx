import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { leaveRequestService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const LeaveRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await leaveRequestService.findAll();
        setRequests(res.data);
      } catch (error) {
        console.error('Failed to fetch leave requests', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

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
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          New Request
        </button>
      </div>
      <DataTable title="All Requests" columns={columns as any} data={requests} />
    </div>
  );
};

export default LeaveRequestsPage;
