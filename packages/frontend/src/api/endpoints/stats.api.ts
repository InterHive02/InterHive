import { apiClient } from '../client';

export interface LandingStatItem {
  key: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  order: number;
  useManualValue: boolean;
  manualValue: number | null;
  lastManualEditAt: string | null;
  lastEditedBy: string | null;
}

export interface UpdateStatPayload {
  manualValue?: number;
  useManualValue?: boolean;
  label?: string;
  suffix?: string;
}

export const statsApi = {
  /** Public: landing page stat values (merged manual + live) */
  getLandingStats: () =>
    apiClient.get<{ success: boolean; data: LandingStatItem[] }>('/stats/landing'),

  /** Admin: full stat configs with edit history */
  getAdminStatConfigs: () =>
    apiClient.get<{ success: boolean; data: LandingStatItem[] }>('/stats/admin/config'),

  /** Admin: update a specific stat by key */
  updateStat: (key: string, payload: UpdateStatPayload) =>
    apiClient.patch<{ success: boolean; data: LandingStatItem }>(`/stats/admin/${key}`, payload),

  /** Admin: sync all stats from live system DB counts */
  syncFromSystemData: () =>
    apiClient.post<{ success: boolean; message: string; data: LandingStatItem[] }>('/stats/admin/sync'),
};
