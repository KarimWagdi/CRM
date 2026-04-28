import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { userService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.findAll();
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: (u: any) => u.role?.name || 'N/A' },
    {
      header: 'Status',
      accessor: (u: any) => <StatusBadge label={u.isActive ? 'Active' : 'Inactive'} type={u.isActive ? 'success' : 'error'} />
    },
    { header: 'Created At', accessor: (u: any) => new Date(u.createdAt).toLocaleDateString() },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">System Users</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          Create User
        </button>
      </div>
      <DataTable title="All Users" columns={columns as any} data={users} />
    </div>
  );
};

export default UsersPage;
