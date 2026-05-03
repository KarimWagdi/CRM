import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { accountService } from '../services/api';

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await accountService.findAll();
        setAccounts(res.data);
      } catch (error) {
        console.error('Failed to fetch accounts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Industry', accessor: 'industry' },
    { header: 'Website', accessor: 'website' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: 'address' },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Accounts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Accounts Management</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          New Account
        </button>
      </div>
      <DataTable title="All Accounts" columns={columns as any} data={accounts} />
    </div>
  );
};

export default AccountsPage;
