import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { attendanceService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const AttendancePage: React.FC = () => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await attendanceService.findAll();
        setAttendance(res.data);
      } catch (error) {
        console.error('Failed to fetch attendance', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const columns = [
    { header: 'Employee', accessor: (a: any) => a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : 'N/A' },
    { header: 'Date', accessor: (a: any) => new Date(a.date).toLocaleDateString() },
    { header: 'Check In', accessor: (a: any) => a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : '-' },
    { header: 'Check Out', accessor: (a: any) => a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : '-' },
    {
      header: 'Status',
      accessor: (a: any) => <StatusBadge label={a.status} type={a.status === 'Present' ? 'success' : a.status === 'Absent' ? 'error' : 'warning'} />
    },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Attendance...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Attendance Records</h2>
      </div>
      <DataTable title="All Records" columns={columns as any} data={attendance} />
    </div>
  );
};

export default AttendancePage;
