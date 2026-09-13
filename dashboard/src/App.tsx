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

import LeadsPage from './pages/LeadsPage';
import AccountsPage from './pages/AccountsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import EmployeesPage from './pages/EmployeesPage';
import LeaveRequestsPage from './pages/LeaveRequestsPage';
import AttendancePage from './pages/AttendancePage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import InvoicesPage from './pages/InvoicesPage';
import BillsPage from './pages/BillsPage';
import SuppliersPage from './pages/SuppliersPage';
import PaymentsPage from './pages/PaymentsPage';
import ExpensesPage from './pages/ExpensesPage';
import InventoryPage from './pages/InventoryPage';
import UsersPage from './pages/UsersPage';
import ChatPage from './pages/ChatPage';

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
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />

          {/* HR Routes */}
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/leave-requests" element={<LeaveRequestsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />

          {/* Project Routes */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/tasks" element={<TasksPage />} />

          {/* Finance Routes */}
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />

          {/* Inventory Routes */}
          <Route path="/inventory" element={<InventoryPage />} />

          {/* System Routes */}
          <Route path="/users" element={<UsersPage />} />

          {/* Chat Routes */}
          <Route path="/chat" element={<ChatPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
