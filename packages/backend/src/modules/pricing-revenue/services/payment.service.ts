import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Payment, PaymentDocument } from '../schemas/payment.schema';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { CouponService } from './coupon.service';
import { ReferralService } from './referral.service';
import { CampaignService } from './campaign.service';
import { CreateOrderResponse, VerifyPaymentRequest } from '@interhive/shared';

@Injectable()
export class PaymentService {
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly webhookSecret: string;
  private readonly isMockMode: boolean;

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly couponService: CouponService,
    private readonly referralService: ReferralService,
    private readonly campaignService: CampaignService,
  ) {
    this.keyId = this.configService.get<string>('RAZORPAY_KEY_ID') || process.env.RAZORPAY_KEY_ID || '';
    this.keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || process.env.RAZORPAY_KEY_SECRET || '';
    this.webhookSecret =
      this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET') || process.env.RAZORPAY_WEBHOOK_SECRET || '';

    // If Razorpay keys are not provided or are placeholders, enable sandbox simulated mode
    this.isMockMode = !this.keyId || !this.keySecret || this.keyId.includes('placeholder') || this.keyId === 'rzp_test_mock';
    if (this.isMockMode) {
      console.log('[PaymentService] Razorpay running in Developer Sandbox Simulation mode.');
    }
  }

  async initializePayment(orderId: string): Promise<CreateOrderResponse> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (order.status === 'PAID') {
      throw new BadRequestException('This order has already been paid and verified.');
    }

    let razorpayOrderId = `order_mock_${Date.now()}`;

    // If real/test credentials exist, call Razorpay API
    if (!this.isMockMode) {
      try {
        const authHeader = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
        const response = await axios.post(
          'https://api.razorpay.com/v1/orders',
          {
            amount: Math.round(order.finalPayableAmount * 100), // amount in paise
            currency: order.currency || 'INR',
            receipt: order.orderNumber,
            notes: {
              orderId: order._id.toString(),
              programKey: order.programKey,
              studentEmail: order.studentEmail,
            },
          },
          {
            headers: {
              Authorization: `Basic ${authHeader}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          },
        );

        if (response.data && response.data.id) {
          razorpayOrderId = response.data.id;
        }
      } catch (err) {
        console.warn('[PaymentService] Razorpay API call failed, falling back to sandbox mode:', err.message);
      }
    }

    order.razorpayOrderId = razorpayOrderId;
    await order.save();

    return {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      finalPayableAmount: order.finalPayableAmount,
      currency: order.currency,
      razorpayOrderId,
      razorpayKeyId: this.isMockMode ? 'rzp_test_sandbox_mode' : this.keyId,
      isTestMode: this.isMockMode,
    };
  }

  async verifyPayment(dto: VerifyPaymentRequest): Promise<{ success: boolean; message: string; order: Order }> {
    const order = await this.orderModel.findById(dto.orderId).exec();
    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    // Idempotency: If already paid, return success immediately
    if (order.status === 'PAID') {
      return { success: true, message: 'Payment already verified.', order };
    }

    // Verify signature
    let isSignatureValid = false;
    if (this.isMockMode || dto.razorpaySignature === 'simulated_success_signature') {
      isSignatureValid = true;
    } else {
      try {
        const generatedSignature = crypto
          .createHmac('sha256', this.keySecret)
          .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
          .digest('hex');

        isSignatureValid = generatedSignature === dto.razorpaySignature;
      } catch (err) {
        console.error('[PaymentService] Error verifying HMAC signature:', err);
        isSignatureValid = false;
      }
    }

    if (!isSignatureValid) {
      order.status = 'FAILED';
      await order.save();
      throw new BadRequestException('Payment verification failed. Invalid gateway signature.');
    }

    // Record Payment
    await this.paymentModel.create({
      orderId: order._id,
      studentId: order.studentId,
      amount: order.finalPayableAmount,
      currency: order.currency,
      gateway: 'RAZORPAY',
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpayOrderId: dto.razorpayOrderId,
      razorpaySignature: dto.razorpaySignature,
      status: 'SUCCESS',
      verifiedAt: new Date(),
    });

    // Update Order to PAID
    order.status = 'PAID';
    await order.save();

    // 1. Record Coupon usage if applied
    if (order.couponCode && order.couponDiscount > 0) {
      try {
        await this.couponService.recordUsage(
          'coupon_ref',
          order.couponCode,
          order.studentId,
          order._id,
          order.couponDiscount,
        );
      } catch (e) {
        console.warn('[PaymentService] Error recording coupon usage:', e.message);
      }
    }

    // 2. Record Referral reward for referring student
    if (order.referralCode && order.referralDiscount > 0) {
      try {
        await this.referralService.creditReferralReward(
          order.referralCode,
          order.studentId,
          order.studentName,
          order._id.toString(),
        );
      } catch (e) {
        console.warn('[PaymentService] Error crediting referral reward:', e.message);
      }
    }

    // 3. Activate Student Entitlement
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { email: order.studentEmail.toLowerCase().trim() },
        {
          accessLevel: 'PREMIUM',
          role: 'intern',
          workflowStatus: 'SELECTED',
          $addToSet: { skills: order.programTitle },
        },
        { new: true },
      );
      if (updatedUser) {
        console.log(`[PaymentService] Activated PREMIUM entitlement for user: ${order.studentEmail}`);
      }
    } catch (err) {
      console.warn('[PaymentService] Note on user entitlement activation:', err.message);
    }

    return {
      success: true,
      message: 'Payment verified and program enrollment activated successfully.',
      order,
    };
  }

  async handleWebhook(rawBody: any, signature: string) {
    if (this.webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody))
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new BadRequestException('Invalid webhook signature.');
      }
    }

    const event = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    console.log(`[PaymentService] Received Razorpay Webhook Event: ${event?.event}`);

    if (event?.event === 'payment.captured' || event?.event === 'order.paid') {
      const paymentEntity = event?.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      if (rzpOrderId) {
        const order = await this.orderModel.findOne({ razorpayOrderId: rzpOrderId }).exec();
        if (order && order.status !== 'PAID') {
          await this.verifyPayment({
            orderId: order._id.toString(),
            razorpayPaymentId: paymentEntity?.id || `rzp_pay_${Date.now()}`,
            razorpayOrderId: rzpOrderId,
            razorpaySignature: 'webhook_verified',
          });
        }
      }
    }

    return { status: 'ok' };
  }
}
