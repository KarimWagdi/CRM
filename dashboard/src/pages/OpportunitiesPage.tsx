import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { opportunityService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const OpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await opportunityService.findAll();
        setOpportunities(res.data);
      } catch (error) {
        console.error('Failed to fetch opportunities', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

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
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          New Opportunity
        </button>
      </div>
      <DataTable title="All Opportunities" columns={columns as any} data={opportunities} />
    </div>
  );
};

export default OpportunitiesPage;
