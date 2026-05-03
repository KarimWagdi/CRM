import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { leadService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await leadService.findAll();
        setLeads(res.data);
      } catch (error) {
        console.error('Failed to fetch leads', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const columns = [
    { header: 'Name', accessor: (l: any) => `${l.firstName} ${l.lastName}` },
    { header: 'Email', accessor: 'email' },
    { header: 'Company', accessor: 'company' },
    {
      header: 'Status',
      accessor: (l: any) => <StatusBadge label={l.status} type={l.status === 'Qualified' ? 'success' : l.status === 'Lost' ? 'error' : 'warning'} />
    },
    { header: 'Source', accessor: 'source' },
    { header: 'Created At', accessor: (l: any) => new Date(l.createdAt).toLocaleDateString() },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Leads...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Leads Management</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          Add Lead
        </button>
      </div>
      <DataTable title="All Leads" columns={columns as any} data={leads} />
    </div>
  );
};

export default LeadsPage;
