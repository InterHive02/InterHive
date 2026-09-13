import { apiClient } from '../client';

export interface CheckInData {
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  ip?: string;
  deviceInfo?: string;
  screenshot?: string;
  reason?: string;
  notes?: string;
}

export interface CheckOutData {
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  ip?: string;
  deviceInfo?: string;
  screenshot?: string;
  reason?: string;
  notes?: string;
}

export const attendanceApi = {
  // Employee
  checkIn: (data: CheckInData) =>
    apiClient.post('/attendance/check-in', data),

  checkOut: (data: CheckOutData) =>
    apiClient.post('/attendance/check-out', data),

  startLunch: () =>
    apiClient.post('/attendance/lunch/start'),

  endLunch: () =>
    apiClient.post('/attendance/lunch/end'),

  getToday: () =>
    apiClient.get('/attendance/today'),

  getHistory: (startDate?: string, endDate?: string, page: number = 1, limit: number = 10) =>
    apiClient.get('/attendance/history', { params: { startDate, endDate, page, limit } }),

  getStats: (month?: number, year?: number) =>
    apiClient.get('/attendance/stats', { params: { month, year } }),

  // Admin/Manager
  getAll: (params: { page: number; limit: number; date?: string; department?: string; status?: string }) =>
    apiClient.get('/attendance/all', { params }),

  getDepartmentAttendance: (departmentId: string, date?: string) =>
    apiClient.get(`/attendance/department/${departmentId}`, { params: { date } }),

  getUserAttendance: (userId: string, startDate?: string, endDate?: string) =>
    apiClient.get(`/attendance/user/${userId}`, { params: { startDate, endDate } }),

  correctAttendance: (id: string, data: any) =>
    apiClient.put(`/attendance/${id}/correct`, data),

  getOverallStats: () =>
    apiClient.get('/attendance/stats/overview'),
};
