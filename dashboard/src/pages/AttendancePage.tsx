import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { attendanceService, employeeService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const AttendancePage: React.FC = () => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    status: 'Present',
  });

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.findAll();
      setAttendance(res.data);
    } catch (error) {
      console.error('Failed to fetch attendance', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.findAll();
      setEmployees(res.data);
    } catch (error) {
      console.error('Failed to fetch employees', error);
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Combine date with checkIn/checkOut times
      const data = {
        ...formData,
        employeeId: Number(formData.employeeId),
        checkIn: formData.checkIn ? new Date(`${formData.date}T${formData.checkIn}`) : undefined,
        checkOut: formData.checkOut ? new Date(`${formData.date}T${formData.checkOut}`) : undefined,
      };
      await attendanceService.create(data);
      setIsModalOpen(false);
      setFormData({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        checkIn: '',
        checkOut: '',
        status: 'Present',
      });
      fetchAttendance();
    } catch (error) {
      console.error('Failed to create attendance record', error);
    }
  };

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
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Record
        </button>
      </div>
      <DataTable title="All Records" columns={columns as any} data={attendance} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Attendance Record"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Check In</label>
              <input
                type="time"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Check Out</label>
              <input
                type="time"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AttendancePage;
