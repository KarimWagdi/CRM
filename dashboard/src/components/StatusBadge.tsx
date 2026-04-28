import React from 'react';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  label: string;
  type?: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, type = 'default' }) => {
  const styles: Record<StatusType, string> = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-rose-100 text-rose-700',
    info: 'bg-blue-100 text-blue-700',
    default: 'bg-slate-100 text-slate-700',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${styles[type]}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
