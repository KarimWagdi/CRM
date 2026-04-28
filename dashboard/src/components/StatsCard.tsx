import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        {trend && (
          <p className="text-xs text-slate-400 mt-2 font-medium">{trend}</p>
        )}
      </div>
      <div className={`${color} p-3 rounded-lg text-white shadow-lg shadow-current/20`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatsCard;
