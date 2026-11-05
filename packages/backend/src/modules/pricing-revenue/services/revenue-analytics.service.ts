import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Refund, RefundDocument } from '../schemas/refund.schema';
import { Coupon, CouponDocument } from '../schemas/coupon.schema';
import { RevenueAnalyticsOverview } from '@interhive/shared';

@Injectable()
export class RevenueAnalyticsService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Refund.name) private readonly refundModel: Model<RefundDocument>,
    @InjectModel(Coupon.name) private readonly couponModel: Model<CouponDocument>,
  ) {}

  async getOverview(): Promise<RevenueAnalyticsOverview> {
    const orders = await this.orderModel.find().exec();
    const refunds = await this.refundModel.find({ status: 'PROCESSED' }).exec();
    const coupons = await this.couponModel.find().exec();

    let totalRevenue = 0;
    let grossOrderValue = 0;
    let totalDiscounts = 0;
    let paidOrders = 0;
    let pendingOrders = 0;

    const programMap: Record<string, { title: string; orderCount: number; revenue: number }> = {};
    const monthMap: Record<string, { revenue: number; ordersCount: number }> = {};

    orders.forEach((o) => {
      grossOrderValue += o.originalPrice || 0;
      totalDiscounts += (o.automaticDiscount || 0) + (o.couponDiscount || 0) + (o.referralDiscount || 0);

      if (o.status === 'PAID') {
        paidOrders++;
        totalRevenue += o.finalPayableAmount || 0;

        // Program breakdown
        const pKey = o.programKey || 'OTHER';
        if (!programMap[pKey]) {
          programMap[pKey] = { title: o.programTitle || pKey, orderCount: 0, revenue: 0 };
        }
        programMap[pKey].orderCount++;
        programMap[pKey].revenue += o.finalPayableAmount || 0;

        // Monthly breakdown
        const date = (o as any).createdAt ? new Date((o as any).createdAt) : new Date();
        const monthKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = { revenue: 0, ordersCount: 0 };
        }
        monthMap[monthKey].revenue += o.finalPayableAmount || 0;
        monthMap[monthKey].ordersCount++;
      } else if (o.status === 'PENDING') {
        pendingOrders++;
      }
    });

    const totalRefunds = refunds.reduce((sum, r) => sum + (r.amount || 0), 0);
    const netRevenue = Math.max(0, totalRevenue - totalRefunds);
    const averageOrderValue = paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0;

    const programBreakdown = Object.entries(programMap).map(([programKey, val]) => ({
      programKey,
      title: val.title,
      orderCount: val.orderCount,
      revenue: val.revenue,
    }));

    const monthlyTrend = Object.entries(monthMap).map(([month, val]) => ({
      month,
      revenue: val.revenue,
      ordersCount: val.ordersCount,
    }));

    const couponPerformance = coupons
      .filter((c) => c.usedCount > 0)
      .map((c) => ({
        code: c.code,
        usageCount: c.usedCount,
        discountTotal: c.usedCount * (c.discountType === 'FIXED' ? c.discountValue : 500),
      }));

    return {
      totalRevenue,
      grossOrderValue,
      totalDiscounts,
      totalRefunds,
      netRevenue,
      totalOrders: orders.length,
      paidOrders,
      pendingOrders,
      averageOrderValue,
      programBreakdown,
      monthlyTrend,
      couponPerformance,
    };
  }

  async getTransactions(filters?: {
    status?: string;
    programKey?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const query: any = {};
    if (filters?.status && filters.status !== 'ALL') {
      query.status = filters.status;
    }
    if (filters?.programKey && filters.programKey !== 'ALL') {
      query.programKey = filters.programKey;
    }
    if (filters?.search && filters.search.trim()) {
      const regex = new RegExp(filters.search.trim(), 'i');
      query.$or = [{ orderNumber: regex }, { studentName: regex }, { studentEmail: regex }, { couponCode: regex }];
    }
    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    return this.orderModel.find(query).sort({ createdAt: -1 }).limit(100).exec();
  }

  async exportTransactionsCsv(): Promise<string> {
    const orders = await this.orderModel.find().sort({ createdAt: -1 }).exec();
    const headers = [
      'Order Number',
      'Date',
      'Student Name',
      'Student Email',
      'Program',
      'Plan',
      'Original Price',
      'Discounts',
      'Coupon Code',
      'Tax Amount',
      'Final Amount',
      'Status',
    ];

    const rows = orders.map((o) => {
      const discounts = (o.automaticDiscount || 0) + (o.couponDiscount || 0) + (o.referralDiscount || 0);
      const date = (o as any).createdAt ? new Date((o as any).createdAt).toISOString().split('T')[0] : '';
      return [
        o.orderNumber,
        date,
        `"${o.studentName}"`,
        o.studentEmail,
        `"${o.programTitle}"`,
        o.paymentPlan,
        o.originalPrice,
        discounts,
        o.couponCode || 'NONE',
        o.taxAmount || 0,
        o.finalPayableAmount,
        o.status,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }
}
