import { apiClient } from '../client';

export interface TestimonialItem {
  _id?: string;
  name: string;
  college: string;
  branch?: string;
  company: string;
  role?: string;
  package?: string;
  rating: number;
  review: string;
  avatar?: string;
  isPublished: boolean;
  order: number;
  createdAt?: string;
}

export interface PartnerItem {
  _id?: string;
  name: string;
  logo?: string;
  website?: string;
  partnershipTier: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
}

export const contentApi = {
  // Public
  getPublicTestimonials: () =>
    apiClient.get<{ success: boolean; data: TestimonialItem[] }>('/content/testimonials'),

  getPublicPartners: () =>
    apiClient.get<{ success: boolean; data: PartnerItem[] }>('/content/partners'),

  // Admin Testimonials
  getAdminTestimonials: () =>
    apiClient.get<{ success: boolean; data: TestimonialItem[] }>('/content/admin/testimonials'),

  createTestimonial: (data: Partial<TestimonialItem>) =>
    apiClient.post<{ success: boolean; data: TestimonialItem }>('/content/admin/testimonials', data),

  updateTestimonial: (id: string, data: Partial<TestimonialItem>) =>
    apiClient.patch<{ success: boolean; data: TestimonialItem }>(`/content/admin/testimonials/${id}`, data),

  deleteTestimonial: (id: string) =>
    apiClient.delete<{ success: boolean }>(`/content/admin/testimonials/${id}`),

  // Admin Partners
  getAdminPartners: () =>
    apiClient.get<{ success: boolean; data: PartnerItem[] }>('/content/admin/partners'),

  createPartner: (data: Partial<PartnerItem>) =>
    apiClient.post<{ success: boolean; data: PartnerItem }>('/content/admin/partners', data),

  updatePartner: (id: string, data: Partial<PartnerItem>) =>
    apiClient.patch<{ success: boolean; data: PartnerItem }>(`/content/admin/partners/${id}`, data),

  deletePartner: (id: string) =>
    apiClient.delete<{ success: boolean }>(`/content/admin/partners/${id}`),
};
