import { ProgramTypeKey } from '../constants/programs';

export type DiscountType = 'PERCENTAGE' | 'FIXED';
export type PaymentPlanType = 'FULL' | 'ANNUAL' | 'INSTALLMENT';
export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'CANCELLED';
export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';
export type RefundStatus = 'PENDING' | 'PROCESSED' | 'REJECTED';
export type CampaignType = 'EARLY_BIRD' | 'LAUNCH' | 'COLLEGE_PARTNER' | 'GROUP' | 'FESTIVAL' | 'CUSTOM';

export interface PaymentPlanConfig {
  id: string;
  name: string;
  type: PaymentPlanType;
  installmentsCount: number;
  amountPerInstallment: number;
  intervalMonths: number;
  description?: string;
}

export interface PricingHistoryEntry {
  version: number;
  originalPrice: number;
  promotionalPrice: number;
  changedAt: string;
  changedBy: string;
  reason: string;
}

export interface ProgramPricingItem {
  id: string;
  programKey: ProgramTypeKey | string;
  title: string;
  duration: string;
  description: string;
  originalPrice: number;
  promotionalPrice: number;
  currency: string;
  isActive: boolean;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  taxPercentage: number;
  taxIncluded: boolean;
  features: string[];
  eligibilityBatch: string;
  paymentPlans: PaymentPlanConfig[];
  pricingVersion: number;
  history?: PricingHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CouponItem {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: number;
  minOrderValue: number;
  applicablePrograms: string[];
  startDate: string;
  expiryDate: string;
  totalUsageLimit: number;
  usedCount: number;
  perUserLimit: number;
  firstTimeOnly: boolean;
  allowStacking: boolean;
  isActive: boolean;
  isPaused: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountCampaignItem {
  id: string;
  name: string;
  description?: string;
  campaignType: CampaignType;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount: number;
  minOrderValue: number;
  eligiblePrograms: string[];
  startDate: string;
  endDate: string;
  budgetCap: number;
  currentSpend: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  programKey: string;
  programTitle: string;
  pricingVersion: number;
  paymentPlan: PaymentPlanType;
  originalPrice: number;
  automaticDiscount: number;
  campaignId?: string;
  couponDiscount: number;
  couponCode?: string;
  referralDiscount: number;
  taxAmount: number;
  finalPayableAmount: number;
  currency: string;
  status: OrderStatus;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentItem {
  id: string;
  orderId: string;
  studentId: string;
  amount: number;
  currency: string;
  gateway: 'RAZORPAY';
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature?: string;
  status: PaymentStatus;
  method?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface RefundItem {
  id: string;
  refundNumber: string;
  orderId: string;
  orderNumber?: string;
  studentName?: string;
  studentEmail?: string;
  paymentId?: string;
  amount: number;
  currency: string;
  reason: string;
  status: RefundStatus;
  razorpayRefundId?: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
}

export interface ReferralInfo {
  referralCode: string;
  walletBalance: number;
  totalEarned: number;
  referralsCount: number;
  rewardPerReferral: number;
  studentDiscountAmount: number;
  history: Array<{
    id: string;
    referredStudentName: string;
    rewardAmount: number;
    date: string;
    status: 'CREDITED' | 'PENDING';
  }>;
}

export interface CheckoutPreviewRequest {
  programKey: string;
  paymentPlan?: PaymentPlanType;
  couponCode?: string;
  referralCode?: string;
}

export interface CheckoutPreviewResponse {
  programKey: string;
  programTitle: string;
  duration: string;
  originalPrice: number;
  promotionalPrice: number;
  baseAmount: number;
  automaticDiscount: number;
  appliedCampaignName?: string;
  couponDiscount: number;
  appliedCouponCode?: string;
  referralDiscount: number;
  taxPercentage: number;
  taxAmount: number;
  finalPayableAmount: number;
  currency: string;
  paymentPlan: PaymentPlanType;
  selectedPlanDetails?: PaymentPlanConfig;
  features: string[];
}

export interface CreateOrderRequest {
  programKey: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  paymentPlan?: PaymentPlanType;
  couponCode?: string;
  referralCode?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  orderNumber: string;
  finalPayableAmount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
  isTestMode: boolean;
}

export interface VerifyPaymentRequest {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface RevenueAnalyticsOverview {
  totalRevenue: number;
  grossOrderValue: number;
  totalDiscounts: number;
  totalRefunds: number;
  netRevenue: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
  programBreakdown: Array<{
    programKey: string;
    title: string;
    orderCount: number;
    revenue: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    ordersCount: number;
  }>;
  couponPerformance: Array<{
    code: string;
    usageCount: number;
    discountTotal: number;
  }>;
}
