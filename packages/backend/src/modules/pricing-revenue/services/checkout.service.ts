import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { PricingService } from './pricing.service';
import { CouponService } from './coupon.service';
import { CampaignService } from './campaign.service';
import { ReferralService } from './referral.service';
import { CheckoutPreviewDto, CreateOrderDto } from '../dto/checkout.dto';
import { CheckoutPreviewResponse, PaymentPlanConfig } from '@interhive/shared';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly pricingService: PricingService,
    private readonly couponService: CouponService,
    private readonly campaignService: CampaignService,
    private readonly referralService: ReferralService,
  ) {}

  async previewCheckout(dto: CheckoutPreviewDto, studentId?: string): Promise<CheckoutPreviewResponse> {
    const program = await this.pricingService.getProgramByKey(dto.programKey);
    if (!program || !program.isActive) {
      throw new BadRequestException('Selected program is not available for enrollment.');
    }

    const selectedPlanType = dto.paymentPlan || 'FULL';
    let selectedPlanDetails: PaymentPlanConfig | undefined;
    let baseAmount = program.promotionalPrice;

    if (program.paymentPlans && program.paymentPlans.length > 0) {
      selectedPlanDetails = program.paymentPlans.find((p) => p.type === selectedPlanType);
      if (selectedPlanDetails) {
        baseAmount = selectedPlanDetails.amountPerInstallment;
      }
    }

    // 1. Automatic Campaign Discount
    let automaticDiscount = 0;
    let appliedCampaignName: string | undefined;
    const activeCampaign = await this.campaignService.getActiveCampaignForProgram(program.programKey, baseAmount);

    if (activeCampaign) {
      if (activeCampaign.discountType === 'PERCENTAGE') {
        automaticDiscount = Math.round((baseAmount * activeCampaign.discountValue) / 100);
        if (activeCampaign.maxDiscount > 0 && automaticDiscount > activeCampaign.maxDiscount) {
          automaticDiscount = activeCampaign.maxDiscount;
        }
      } else {
        automaticDiscount = activeCampaign.discountValue;
      }
      appliedCampaignName = activeCampaign.name;
    }

    // 2. Coupon Discount
    let couponDiscount = 0;
    let appliedCouponCode: string | undefined;

    if (dto.couponCode && dto.couponCode.trim()) {
      const couponValidation = await this.couponService.validateCoupon(
        dto.couponCode,
        program.programKey,
        baseAmount,
        studentId,
      );

      // Check stacking rule: if coupon doesn't allow stacking, pick either campaign or coupon (whichever gives greater discount)
      if (!couponValidation.allowStacking && automaticDiscount > 0) {
        if (couponValidation.discountAmount > automaticDiscount) {
          couponDiscount = couponValidation.discountAmount;
          automaticDiscount = 0;
          appliedCampaignName = undefined;
          appliedCouponCode = couponValidation.code;
        } else {
          couponDiscount = 0;
        }
      } else {
        couponDiscount = couponValidation.discountAmount;
        appliedCouponCode = couponValidation.code;
      }
    }

    // 3. Referral Discount
    let referralDiscount = 0;
    if (dto.referralCode && dto.referralCode.trim()) {
      const refValidation = await this.referralService.validateReferralCode(dto.referralCode, studentId);
      referralDiscount = refValidation.discountAmount;
    }

    // Subtotal after discounts
    const subtotalAfterDiscounts = Math.max(0, baseAmount - automaticDiscount - couponDiscount - referralDiscount);

    // 4. Tax (GST) - All program fees are fixed and inclusive of all taxes
    const taxAmount = 0;
    const finalPayableAmount = Math.max(0, subtotalAfterDiscounts);

    return {
      programKey: program.programKey,
      programTitle: program.title,
      duration: program.duration,
      originalPrice: program.originalPrice,
      promotionalPrice: program.promotionalPrice,
      baseAmount,
      automaticDiscount,
      appliedCampaignName,
      couponDiscount,
      appliedCouponCode,
      referralDiscount,
      taxPercentage: program.taxPercentage,
      taxAmount,
      finalPayableAmount,
      currency: program.currency || 'INR',
      paymentPlan: selectedPlanType,
      selectedPlanDetails,
      features: program.features || [],
    };
  }

  async createOrder(dto: CreateOrderDto, studentId?: string): Promise<Order> {
    const preview = await this.previewCheckout(
      {
        programKey: dto.programKey,
        paymentPlan: dto.paymentPlan,
        couponCode: dto.couponCode,
        referralCode: dto.referralCode,
      },
      studentId,
    );

    const program = await this.pricingService.getProgramByKey(dto.programKey);

    // Generate unique order number: e.g. ORD-2026-89412
    const currentYear = new Date().getFullYear();
    const randomSeq = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ORD-${currentYear}-${randomSeq}`;

    const resolvedStudentId = studentId || `guest_${Date.now()}`;

    const createdOrder = await this.orderModel.create({
      orderNumber,
      studentId: resolvedStudentId,
      studentName: dto.studentName,
      studentEmail: dto.studentEmail.toLowerCase().trim(),
      studentPhone: dto.studentPhone,
      programKey: preview.programKey,
      programTitle: preview.programTitle,
      pricingVersion: program.pricingVersion,
      paymentPlan: preview.paymentPlan,
      originalPrice: preview.originalPrice,
      automaticDiscount: preview.automaticDiscount,
      couponDiscount: preview.couponDiscount,
      couponCode: preview.appliedCouponCode,
      referralDiscount: preview.referralDiscount,
      referralCode: dto.referralCode ? dto.referralCode.trim().toUpperCase() : undefined,
      taxAmount: preview.taxAmount,
      finalPayableAmount: preview.finalPayableAmount,
      currency: preview.currency,
      status: 'PENDING',
      notes: dto.notes,
    });

    return createdOrder;
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) throw new NotFoundException('Order not found.');
    return order;
  }

  async getMyOrders(studentEmail: string, studentId?: string): Promise<Order[]> {
    const query: any = {
      $or: [{ studentEmail: studentEmail.toLowerCase().trim() }],
    };
    if (studentId) {
      query.$or.push({ studentId });
    }
    return this.orderModel.find(query).sort({ createdAt: -1 }).exec();
  }
}
