import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface AttendanceCalendarProps {
  attendances: {
    date: string;
    status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'holiday';
    checkIn?: string;
    checkOut?: string;
    workingHours?: number;
  }[];
  onDateSelect?: (date: string) => void;
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  attendances,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getDayStatus = (day: number) => {
    if (!day) return null;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    const attendance = attendances.find(a => a.date === dateStr);
    return attendance?.status || null;
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 dark:bg-gray-700';
    switch (status) {
      case 'present':
        return 'bg-green-500 text-white';
      case 'late':
        return 'bg-yellow-500 text-white';
      case 'half_day':
        return 'bg-orange-500 text-white';
      case 'on_leave':
        return 'bg-blue-500 text-white';
      case 'holiday':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-red-500 text-white';
    }
  };

  const getStatusIcon = (status: string | null) => {
    if (!status) return null;
    switch (status) {
      case 'present':
        return <CheckCircle className="w-3 h-3" />;
      case 'absent':
        return <XCircle className="w-3 h-3" />;
      case 'late':
        return <Clock className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const handleDayClick = (day: number) => {
    if (!day) return;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    onDateSelect?.(dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const getAttendanceStats = () => {
    const monthAttendances = attendances.filter(a => {
      const date = new Date(a.date);
      return date.getMonth() === currentDate.getMonth() &&
             date.getFullYear() === currentDate.getFullYear();
    });

    const stats = {
      present: monthAttendances.filter(a => a.status === 'present').length,
      late: monthAttendances.filter(a => a.status === 'late').length,
      absent: monthAttendances.filter(a => a.status === 'absent').length,
      leave: monthAttendances.filter(a => a.status === 'on_leave').length,
    };

    return stats;
  };

  const stats = getAttendanceStats();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Calendar</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {monthName} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const status = day ? getDayStatus(day) : null;
          const isSelected = day ? selectedDate === 
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0] : false;

          return (
            <button
              key={index}
              onClick={() => day && handleDayClick(day)}
              disabled={!day}
              className={`
                relative aspect-square rounded-lg flex items-center justify-center text-sm transition-colors
                ${!day ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'}
                ${isSelected ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800' : ''}
                ${status ? getStatusColor(status) : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'}
                ${!day ? 'opacity-0' : ''}
              `}
            >
              {day}
              {status && (
                <span className="absolute -top-1 -right-1">
                  {getStatusIcon(status)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Present</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Late</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Absent</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-gray-600 dark:text-gray-400">On Leave</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-purple-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Holiday</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-4 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">{stats.present}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Present</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{stats.late}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Late</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">{stats.absent}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Absent</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{stats.leave}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Leave</p>
        </div>
      </div>
    </div>
  );
};
