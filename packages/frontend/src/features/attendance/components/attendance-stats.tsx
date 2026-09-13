import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Calendar, Award } from 'lucide-react';

interface AttendanceStatsProps {
  stats: {
    present: number;
    absent: number;
    late: number;
    halfDay: number;
    onLeave: number;
    totalWorkingHours: number;
    totalOvertime: number;
    totalLateMinutes: number;
    totalDays: number;
    workingDays: number;
    attendanceRate: number;
  };
  monthlyData?: {
    week: string;
    hours: number;
    days: number;
  }[];
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  stats,
  monthlyData = [],
}) => {
  const pieData = [
    { name: 'Present', value: stats.present, color: '#10B981' },
    { name: 'Late', value: stats.late, color: '#F59E0B' },
    { name: 'Half Day', value: stats.halfDay, color: '#F97316' },
    { name: 'On Leave', value: stats.onLeave, color: '#3B82F6' },
    { name: 'Absent', value: stats.absent, color: '#EF4444' },
  ];

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Attendance Rate</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.attendanceRate}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {stats.present} / {stats.workingDays} days
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Working Hours</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatTime(stats.totalWorkingHours)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Overtime: {formatTime(stats.totalOvertime)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-yellow-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Late Arrivals</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.late}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total: {stats.totalLateMinutes} min late
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Days Present</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.present}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Out of {stats.totalDays} days
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Attendance Distribution
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Weekly Performance
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="hours" fill="#4F46E5" name="Hours Worked" />
                <Bar dataKey="days" fill="#10B981" name="Days Present" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
