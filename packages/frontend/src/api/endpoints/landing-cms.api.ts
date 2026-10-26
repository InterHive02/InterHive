import { apiClient, ApiResponse } from '../client';
import { LandingPageConfig, MediaAssetItem, LandingRevisionItem } from '@interhive/shared';

export const landingCmsApi = {
  // Public
  getPublicConfig: () =>
    apiClient.get<ApiResponse<LandingPageConfig>>('/landing-cms/public'),

  // Admin CMS
  getDraftConfig: () =>
    apiClient.get<ApiResponse<LandingPageConfig>>('/landing-cms/draft'),

  saveDraft: (data: Partial<LandingPageConfig>) =>
    apiClient.put<ApiResponse<LandingPageConfig>>('/landing-cms/draft', data),

  publishDraft: (notes?: string) =>
    apiClient.post<ApiResponse<LandingPageConfig>>('/landing-cms/publish', { notes }),

  getRevisions: () =>
    apiClient.get<ApiResponse<LandingRevisionItem[]>>('/landing-cms/revisions'),

  restoreRevision: (revisionId: string) =>
    apiClient.post<ApiResponse<LandingPageConfig>>(`/landing-cms/revisions/${revisionId}/restore`, {}),

  resetToDefaults: () =>
    apiClient.post<ApiResponse<LandingPageConfig>>('/landing-cms/reset', {}),

  // Media Library
  getMediaList: () =>
    apiClient.get<ApiResponse<MediaAssetItem[]>>('/landing-cms/media'),

  uploadMedia: (file: File, altText?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('altText', altText);
    return apiClient.post<ApiResponse<MediaAssetItem>>('/landing-cms/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteMedia: (id: string) =>
    apiClient.delete<ApiResponse<{ success: boolean }>>(`/landing-cms/media/${id}`),
};
