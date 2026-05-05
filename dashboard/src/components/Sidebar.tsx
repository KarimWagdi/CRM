import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
  ClipboardList,
  UserCheck,
  CreditCard,
  Building2,
  Package,
  Truck,
  Receipt
  Coffee,
  MessageSquare
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const getLinks = () => {
    const baseLinks = [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/chat', icon: MessageSquare, label: 'Chat' },
    ];

    const adminLinks = [
      { to: '/accounts', icon: Building2, label: 'Accounts' },
      { to: '/users', icon: Users, label: 'Users' },
      { to: '/employees', icon: UserCheck, label: 'HR' },
      { to: '/projects', icon: Briefcase, label: 'Projects' },
      { to: '/invoices', icon: FileText, label: 'Finance' },
      { to: '/inventory', icon: Package, label: 'Inventory' },
      { to: '/cafeteria', icon: Coffee, label: 'Cafeteria' },
      { to: '/drink-management', icon: Coffee, label: 'Cafeteria Admin' },
    ];

    const salesLinks = [
      { to: '/leads', icon: TrendingUp, label: 'Leads' },
      { to: '/accounts', icon: Building2, label: 'Accounts' },
      { to: '/opportunities', icon: TrendingUp, label: 'Opportunities' },
      { to: '/cafeteria', icon: Coffee, label: 'Cafeteria' },
    ];

    const hrLinks = [
      { to: '/employees', icon: Users, label: 'Employees' },
      { to: '/leave-requests', icon: ClipboardList, label: 'Leave Requests' },
      { to: '/attendance', icon: UserCheck, label: 'Attendance' },
      { to: '/cafeteria', icon: Coffee, label: 'Cafeteria' },
    ];

    const projectLinks = [
      { to: '/projects', icon: Briefcase, label: 'Projects' },
      { to: '/tasks', icon: ClipboardList, label: 'Tasks' },
      { to: '/cafeteria', icon: Coffee, label: 'Cafeteria' },
    ];

    const financeLinks = [
      { to: '/invoices', icon: FileText, label: 'Invoices' },
      { to: '/bills', icon: Receipt, label: 'Bills' },
      { to: '/suppliers', icon: Truck, label: 'Suppliers' },
      { to: '/payments', icon: CreditCard, label: 'Payments' },
      { to: '/expenses', icon: TrendingUp, label: 'Expenses' },
      { to: '/inventory', icon: Package, label: 'Inventory' },
      { to: '/cafeteria', icon: Coffee, label: 'Cafeteria' },
    ];

    const baseLinksWithCafeteria = [
      ...baseLinks,
      { to: '/cafeteria', icon: Coffee, label: 'Cafeteria' },
    ];

    switch (role) {
      case 'Admin': return [...baseLinks, ...adminLinks];
      case 'Sales': return [...baseLinks, ...salesLinks];
      case 'HR': return [...baseLinks, ...hrLinks];
      case 'Project': return [...baseLinks, ...projectLinks];
      case 'Finance': return [...baseLinks, ...financeLinks];
      default: return baseLinksWithCafeteria;
    }
  };

  const links = getLinks();

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">C</div>
          <span>CRM Dashboard</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">{role} Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center justify-between p-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <link.icon size={20} />
              <span>{link.label}</span>
            </div>
            <ChevronRight size={16} className="opacity-50" />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 w-full p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors mt-1">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
