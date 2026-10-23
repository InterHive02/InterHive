import { attendanceApi, CheckInData, CheckOutData } from '../../../api/endpoints/attendance.api';
import { toast } from 'react-hot-toast';

export interface QueuedAttendanceRecord {
  id: string;
  type: 'checkIn' | 'checkOut';
  data: CheckInData | CheckOutData;
  timestamp: string;
}

const STORAGE_KEY = 'interhive_attendance_offline_queue';

export const attendanceOfflineService = {
  getQueue(): QueuedAttendanceRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  enqueue(type: 'checkIn' | 'checkOut', data: CheckInData | CheckOutData) {
    const queue = this.getQueue();
    const newRecord: QueuedAttendanceRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      data,
      timestamp: new Date().toISOString(),
    };
    queue.push(newRecord);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to store offline attendance record', e);
    }
    return newRecord;
  },

  clearQueue() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear attendance queue', e);
    }
  },

  async syncPending(onSuccess?: () => void): Promise<{ synced: number; failed: number }> {
    const queue = this.getQueue();
    if (queue.length === 0) return { synced: 0, failed: 0 };

    let synced = 0;
    let failed = 0;
    const remaining: QueuedAttendanceRecord[] = [];

    for (const record of queue) {
      try {
        if (record.type === 'checkIn') {
          await attendanceApi.checkIn(record.data as CheckInData);
        } else {
          await attendanceApi.checkOut(record.data as CheckOutData);
        }
        synced++;
      } catch (err: any) {
        // If it was already checked in/out on backend, consider it resolved
        const msg = err?.response?.data?.message?.toLowerCase() || '';
        if (msg.includes('already checked in') || msg.includes('already checked out')) {
          synced++;
        } else {
          remaining.push(record);
          failed++;
        }
      }
    }

    try {
      if (remaining.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}

    if (synced > 0) {
      toast.success(`⚡ Synced ${synced} offline attendance record${synced > 1 ? 's' : ''}!`);
      onSuccess?.();
    }

    return { synced, failed };
  },

  initAutoSync(onSyncSuccess?: () => void) {
    if (typeof window === 'undefined') return () => {};

    const handleOnline = () => {
      this.syncPending(onSyncSuccess);
    };

    window.addEventListener('online', handleOnline);

    // Also run an initial sync check if network is currently online
    if (navigator.onLine && this.getQueue().length > 0) {
      setTimeout(() => this.syncPending(onSyncSuccess), 1500);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  },
};
