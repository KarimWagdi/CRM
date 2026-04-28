import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Dashboards
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';
import HRDashboard from './pages/HRDashboard';
import ProjectDashboard from './pages/ProjectDashboard';
import FinanceDashboard from './pages/FinanceDashboard';

// Placeholder Pages
const Placeholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
    <h2 className="text-2xl font-bold text-slate-800">{title} Page</h2>
    <p className="text-slate-500 mt-2">This is a placeholder for the {title.toLowerCase()} management view.</p>
  </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, setRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role={role} />
      <Header role={role} onRoleChange={(newRole) => setRole(newRole as any)} />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const { role } = useAuth();

  const getDashboard = () => {
    switch (role) {
      case 'Admin': return <AdminDashboard />;
      case 'Sales': return <SalesDashboard />;
      case 'HR': return <HRDashboard />;
      case 'Project': return <ProjectDashboard />;
      case 'Finance': return <FinanceDashboard />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={getDashboard()} />

          {/* CRM Routes */}
          <Route path="/leads" element={<Placeholder title="Leads" />} />
          <Route path="/accounts" element={<Placeholder title="Accounts" />} />
          <Route path="/opportunities" element={<Placeholder title="Opportunities" />} />

          {/* HR Routes */}
          <Route path="/employees" element={<Placeholder title="Employees" />} />
          <Route path="/leave-requests" element={<Placeholder title="Leave Requests" />} />
          <Route path="/attendance" element={<Placeholder title="Attendance" />} />

          {/* Project Routes */}
          <Route path="/projects" element={<Placeholder title="Projects" />} />
          <Route path="/tasks" element={<Placeholder title="Tasks" />} />

          {/* Finance Routes */}
          <Route path="/invoices" element={<Placeholder title="Invoices" />} />
          <Route path="/payments" element={<Placeholder title="Payments" />} />
          <Route path="/expenses" element={<Placeholder title="Expenses" />} />

          {/* System Routes */}
          <Route path="/users" element={<Placeholder title="Users" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
