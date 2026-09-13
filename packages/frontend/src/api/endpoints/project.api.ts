import { apiClient } from '../client';

export interface Project {
  companyId: string;
  title: string;
  description?: string;
  category: string[];
  requiredSkills: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];
  teamSize: {
    min: number;
    max: number;
  };
  duration: {
    weeks: number;
    startDate: string;
    endDate: string;
  };
  workType: 'remote' | 'hybrid' | 'onsite';
  tasks: ProjectTask[];
  assignedTo?: string[];
  mentors?: string[];
}

export interface ProjectTask {
  title: string;
  description?: string;
  assignedTo?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  storyPoints?: number;
  startDate?: string;
  endDate?: string;
}

export const projectApi = {
  // Projects
  create: (data: Project) =>
    apiClient.post('/projects', data),

  getAll: (params: { page: number; limit: number; status?: string; companyId?: string; assignedTo?: string; search?: string }) =>
    apiClient.get<{ data: Project[]; meta: any }>('/projects', { params }),

  getById: (id: string) =>
    apiClient.get<Project>(`/projects/${id}`),

  update: (id: string, data: Partial<Project>) =>
    apiClient.put(`/projects/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/projects/${id}`),

  getMyProjects: (status?: string) =>
    apiClient.get<Project[]>('/projects/my', { params: { status } }),

  assignInterns: (projectId: string, internIds: string[]) =>
    apiClient.post(`/projects/${projectId}/assign`, { internIds }),

  startProject: (id: string) =>
    apiClient.post(`/projects/${id}/start`),

  completeProject: (id: string) =>
    apiClient.post(`/projects/${id}/complete`),

  // Tasks
  createTask: (projectId: string, data: Partial<ProjectTask>) =>
    apiClient.post(`/projects/${projectId}/tasks`, data),

  updateTask: (taskId: string, data: Partial<ProjectTask>) =>
    apiClient.put(`/projects/tasks/${taskId}`, data),

  updateTaskStatus: (taskId: string, status: string) =>
    apiClient.post(`/projects/tasks/${taskId}/status`, { status }),

  deleteTask: (taskId: string) =>
    apiClient.delete(`/projects/tasks/${taskId}`),

  // Uploads
  uploadFiles: (projectId: string, files: File[], taskId?: string) =>
    apiClient.uploadMultiple(`/projects/${projectId}/uploads`, files, 'files'),

  getUploads: (projectId: string, taskId?: string) =>
    apiClient.get(`/projects/${projectId}/uploads`, { params: { taskId } }),

  deleteUpload: (uploadId: string) =>
    apiClient.delete(`/projects/uploads/${uploadId}`),

  // Stats
  getStats: () =>
    apiClient.get('/projects/stats/overview'),
};
