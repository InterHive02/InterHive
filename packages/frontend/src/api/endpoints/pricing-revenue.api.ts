import { apiClient } from '../client';
import {
  ProgramPricingItem,
  CouponItem,
  DiscountCampaignItem,
  OrderItem,
  RefundItem,
  ReferralInfo,
  RevenueAnalyticsOverview,
  CheckoutPreviewRequest,
  CheckoutPreviewResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentRequest,
} from '@interhive/shared';

export interface ValidateCouponResponse {
  valid: boolean;
  code?: string;
  discountAmount: number;
  message?: string;
  coupon?: CouponItem;
}

export const pricingApi = {
  // Public / Student Endpoints
  getPublicPrograms: async () => {
    return apiClient.get<ProgramPricingItem[]>('/pricing/programs');
  },

  getActivePrograms: async () => {
    return apiClient.get<ProgramPricingItem[]>('/pricing/programs');
  },

  getProgramByKey: async (key: string) => {
    return apiClient.get<ProgramPricingItem>(`/pricing/programs/${key}`);
  },

  previewCheckout: async (dto: CheckoutPreviewRequest) => {
    return apiClient.post<CheckoutPreviewResponse>('/checkout/preview', dto);
  },

  createOrder: async (dto: any) => {
    return apiClient.post<{ order: OrderItem; gateway: CreateOrderResponse }>('/checkout/create-order', dto);
  },

  initRazorpayPayment: async (dto: { orderId: string }) => {
    return apiClient.post<{
      orderId: string;
      razorpayOrderId: string;
      keyId: string;
      amount: number;
      currency: string;
      isSimulated: boolean;
    }>('/payments/init', dto);
  },

  verifyRazorpayPayment: async (dto: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    return apiClient.post<{
      success: boolean;
      order: OrderItem;
      transactionId: string;
    }>('/payments/verify', dto);
  },

  validateCoupon: async (dto: { code: string; programKey: string; orderAmount: number; studentId?: string }) => {
    return apiClient.post<ValidateCouponResponse>('/coupons/validate', dto);
  },

  validateReferral: async (code: string, studentId?: string) => {
    return apiClient.post<{ valid: boolean; discountAmount: number; message?: string }>('/referrals/validate', {
      code,
      studentId,
    });
  },

  getMyOrders: async () => {
    return apiClient.get<OrderItem[]>('/checkout/my-orders');
  },

  getOrderById: async (id: string) => {
    return apiClient.get<OrderItem>(`/checkout/orders/${id}`);
  },

  getMyReferralInfo: async () => {
    return apiClient.get<ReferralInfo>('/referrals/my-code');
  },

  // Admin Endpoints
  getAdminPrograms: async () => {
    return apiClient.get<ProgramPricingItem[]>('/pricing/admin/programs');
  },

  createProgramPricing: async (dto: any) => {
    return apiClient.post<ProgramPricingItem>('/pricing/admin/programs', dto);
  },

  updateProgramPricing: async (id: string, dto: any) => {
    return apiClient.patch<ProgramPricingItem>(`/pricing/admin/programs/${id}`, dto);
  },

  toggleProgramActive: async (id: string, isActive: boolean) => {
    return apiClient.patch<ProgramPricingItem>(`/pricing/admin/programs/${id}/toggle`, { isActive });
  },

  getAdminCoupons: async (isActive?: boolean) => {
    return apiClient.get<CouponItem[]>('/coupons/admin/list', { params: { isActive } });
  },

  createCoupon: async (dto: any) => {
    return apiClient.post<CouponItem>('/coupons/admin', dto);
  },

  updateCoupon: async (id: string, dto: any) => {
    return apiClient.patch<CouponItem>(`/coupons/admin/${id}`, dto);
  },

  togglePauseCoupon: async (id: string, isPaused: boolean) => {
    return apiClient.patch<CouponItem>(`/coupons/admin/${id}/pause`, { isPaused });
  },

  deleteCoupon: async (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(`/coupons/admin/${id}`);
  },

  getAdminCampaigns: async () => {
    return apiClient.get<DiscountCampaignItem[]>('/admin/revenue/campaigns');
  },

  createCampaign: async (dto: any) => {
    return apiClient.post<DiscountCampaignItem>('/admin/revenue/campaigns', dto);
  },

  updateCampaign: async (id: string, dto: any) => {
    return apiClient.patch<DiscountCampaignItem>(`/admin/revenue/campaigns/${id}`, dto);
  },

  getRevenueOverview: async () => {
    return apiClient.get<RevenueAnalyticsOverview>('/admin/revenue/overview');
  },

  getTransactions: async (params?: any) => {
    return apiClient.get<OrderItem[]>('/admin/revenue/transactions', { params });
  },

  getRefunds: async () => {
    return apiClient.get<RefundItem[]>('/admin/revenue/refunds');
  },

  createRefund: async (dto: any) => {
    return apiClient.post<RefundItem>('/admin/revenue/refunds', dto);
  },

  approveRefund: async (id: string) => {
    return apiClient.post<RefundItem>(`/admin/revenue/refunds/${id}/approve`);
  },

  rejectRefund: async (id: string, rejectionReason: string) => {
    return apiClient.post<RefundItem>(`/admin/revenue/refunds/${id}/reject`, { rejectionReason });
  },

  getExportCsvUrl: () => '/api/v1/admin/revenue/export',
};
