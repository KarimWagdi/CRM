import React from 'react';
import { Bell, Search, User } from 'lucide-react';

interface HeaderProps {
  role: string;
  onRoleChange: (role: string) => void;
}

const Header: React.FC<HeaderProps> = ({ role, onRoleChange }) => {
  const roles = ['Admin', 'Sales', 'HR', 'Project', 'Finance'];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 ml-64">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search everything..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Switch Role:</span>
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="text-sm font-medium bg-slate-100 border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
          >
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <button className="relative text-slate-500 hover:text-slate-700">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">3</span>
        </button>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Jules Engineer</p>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
