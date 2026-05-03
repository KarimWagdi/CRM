import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { employeeService } from '../services/api';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeService.findAll();
        setEmployees(res.data);
      } catch (error) {
        console.error('Failed to fetch employees', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const columns = [
    { header: 'Name', accessor: (e: any) => `${e.firstName} ${e.lastName}` },
    { header: 'Email', accessor: 'email' },
    { header: 'Department', accessor: (e: any) => e.department?.name || 'N/A' },
    { header: 'Position', accessor: (e: any) => e.position?.title || 'N/A' },
    { header: 'Hire Date', accessor: (e: any) => e.hireDate ? new Date(e.hireDate).toLocaleDateString() : '-' },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Employees...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Employees Management</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          Add Employee
        </button>
      </div>
      <DataTable title="All Employees" columns={columns as any} data={employees} />
    </div>
  );
};

export default EmployeesPage;
