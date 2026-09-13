import React, { useState } from 'react';
import { CheckInButton } from '../components/check-in-button';
import { CheckOutButton } from '../components/check-out-button';
import { AttendanceCalendar } from '../components/attendance-calendar';
import { AttendanceStats } from '../components/attendance-stats';
import { useAttendance } from '../hooks/use-attendance';
import { toast } from 'react-hot-toast';

export const AttendancePage: React.FC = () => {
  const { useToday, useHistory, useStats, useOverallStats } = useAttendance();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: today, refetch: refetchToday } = useToday();
  const { data: history } = useHistory(
    selectedDate || undefined,
    undefined,
    1,
    30
  );
  const { data: stats } = useStats(
    new Date().getMonth() + 1,
    new Date().getFullYear()
  );
  const { data: overallStats } = useOverallStats();

  const handleCheckInSuccess = () => {
    refetchToday();
    toast.success('Checked in successfully!');
  };

  const handleCheckOutSuccess = () => {
    refetchToday();
    toast.success('Checked out successfully!');
  };

  // Prepare calendar data
  const calendarData = history?.data?.map((record: any) => ({
    date: new Date(record.date).toISOString().split('T')[0],
    status: record.status,
    checkIn: record.checkIn?.time,
    checkOut: record.checkOut?.time,
    workingHours: record.workingHours?.totalHours,
  })) || [];

  // Prepare monthly data for stats
  const monthlyData = stats ? [
    { week: 'Week 1', hours: stats.totalWorkingHours / 4, days: stats.present / 4 },
    { week: 'Week 2', hours: stats.totalWorkingHours / 4, days: stats.present / 4 },
    { week: 'Week 3', hours: stats.totalWorkingHours / 4, days: stats.present / 4 },
    { week: 'Week 4', hours: stats.totalWorkingHours / 4, days: stats.present / 4 },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your daily attendance and view your history
        </p>
      </div>

      {/* Check In/Out */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckInButton
          onSuccess={handleCheckInSuccess}
          onError={(error) => toast.error(error.response?.data?.message || 'Failed to check in')}
        />
        <CheckOutButton
          onSuccess={handleCheckOutSuccess}
          onError={(error) => toast.error(error.response?.data?.message || 'Failed to check out')}
        />
      </div>

      {/* Stats */}
      {stats && (
        <AttendanceStats
          stats={{
            present: stats.present || 0,
            absent: stats.absent || 0,
            late: stats.late || 0,
            halfDay: stats.halfDay || 0,
            onLeave: stats.onLeave || 0,
            totalWorkingHours: stats.totalWorkingHours || 0,
            totalOvertime: stats.totalOvertime || 0,
            totalLateMinutes: stats.totalLateMinutes || 0,
            totalDays: stats.totalDays || 30,
            workingDays: stats.workingDays || 22,
            attendanceRate: stats.attendanceRate || 0,
          }}
          monthlyData={monthlyData}
        />
      )}

      {/* Calendar */}
      <AttendanceCalendar
        attendances={calendarData}
        onDateSelect={setSelectedDate}
      />

      {/* Today's Details */}
      {today && today.checkIn && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Today's Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check In</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {today.checkIn.time ? new Date(today.checkIn.time).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check Out</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {today.checkOut?.time ? new Date(today.checkOut.time).toLocaleTimeString() : 'Not checked out'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">
                {today.status || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Working Hours</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {today.workingHours?.totalHours ? `${today.workingHours.totalHours}h` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
