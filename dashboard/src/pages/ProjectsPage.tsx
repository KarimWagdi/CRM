import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { projectService } from '../services/api';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.findAll();
        setProjects(res.data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          New Project
        </button>
      </div>
      <DataTable title="All Projects" columns={columns as any} data={projects} />
    </div>
  );
};

export default ProjectsPage;
