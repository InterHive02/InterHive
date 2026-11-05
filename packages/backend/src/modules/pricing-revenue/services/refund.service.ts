import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Refund, RefundDocument } from '../schemas/refund.schema';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Payment, PaymentDocument } from '../schemas/payment.schema';
import { PricingAuditLog, PricingAuditLogDocument } from '../schemas/pricing-audit-log.schema';
import { CreateRefundDto, RejectRefundDto } from '../dto/refund.dto';

@Injectable()
export class RefundService {
  private readonly keyId: string;
  private readonly keySecret: string;

  constructor(
    @InjectModel(Refund.name) private readonly refundModel: Model<RefundDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(PricingAuditLog.name) private readonly auditModel: Model<PricingAuditLogDocument>,
    private readonly configService: ConfigService,
  ) {
    this.keyId = this.configService.get<string>('RAZORPAY_KEY_ID') || process.env.RAZORPAY_KEY_ID || '';
    this.keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || process.env.RAZORPAY_KEY_SECRET || '';
  }

  async getAllRefunds(): Promise<Refund[]> {
    return this.refundModel.find().sort({ createdAt: -1 }).exec();
  }

  async createRefundRequest(dto: CreateRefundDto, requestedBy: any): Promise<Refund> {
    const order = await this.orderModel.findById(dto.orderId).exec();
    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (order.status !== 'PAID') {
      throw new BadRequestException('Refund can only be issued for fully paid orders.');
    }

    if (dto.amount > order.finalPayableAmount) {
      throw new BadRequestException(
        `Refund amount (₹${dto.amount}) cannot exceed the actual amount paid (₹${order.finalPayableAmount}).`,
      );
    }

    const payment = await this.paymentModel.findOne({ orderId: order._id, status: 'SUCCESS' }).exec();

    const refundNumber = `REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const refund = await this.refundModel.create({
      refundNumber,
      orderId: order._id,
      paymentId: payment ? payment._id : undefined,
      studentId: order.studentId,
      amount: dto.amount,
      currency: order.currency,
      reason: dto.reason,
      status: 'PENDING',
      processedBy: requestedBy?.email || 'admin',
    });

    await this.auditModel.create({
      action: 'REQUEST_REFUND',
      performedBy: requestedBy?.email || 'admin',
      entityType: 'REFUND',
      entityId: refund._id.toString(),
      newState: { orderId: dto.orderId, amount: dto.amount, reason: dto.reason },
      notes: `Requested refund for order ${order.orderNumber}`,
    });

    return refund;
  }

  async approveRefund(refundId: string, adminUser: any): Promise<Refund> {
    const refund = await this.refundModel.findById(refundId).exec();
    if (!refund) throw new NotFoundException('Refund request not found.');

    if (refund.status === 'PROCESSED') {
      throw new BadRequestException('This refund has already been processed.');
    }

    const order = await this.orderModel.findById(refund.orderId).exec();
    const payment = refund.paymentId ? await this.paymentModel.findById(refund.paymentId).exec() : null;

    let razorpayRefundId = `rfnd_mock_${Date.now()}`;

    // If real credentials and payment ID exist, call Razorpay refund API
    if (this.keyId && this.keySecret && payment?.razorpayPaymentId && !payment.razorpayPaymentId.startsWith('simulated_')) {
      try {
        const authHeader = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
        const response = await axios.post(
          `https://api.razorpay.com/v1/payments/${payment.razorpayPaymentId}/refund`,
          {
            amount: Math.round(refund.amount * 100),
            notes: {
              reason: refund.reason,
              refundNumber: refund.refundNumber,
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
          razorpayRefundId = response.data.id;
        }
      } catch (err) {
        console.warn('[RefundService] Razorpay refund API error, falling back to recorded status:', err.message);
      }
    }

    refund.status = 'PROCESSED';
    refund.razorpayRefundId = razorpayRefundId;
    refund.processedAt = new Date();
    refund.processedBy = adminUser?.email || 'admin';
    await refund.save();

    if (order) {
      order.status = refund.amount >= order.finalPayableAmount ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
      await order.save();
    }

    await this.auditModel.create({
      action: 'APPROVE_REFUND',
      performedBy: adminUser?.email || 'admin',
      entityType: 'REFUND',
      entityId: refundId,
      newState: { status: 'PROCESSED', razorpayRefundId },
      notes: `Approved refund of ₹${refund.amount} for order ${order?.orderNumber}`,
    });

    return refund;
  }

  async rejectRefund(refundId: string, dto: RejectRefundDto, adminUser: any): Promise<Refund> {
    const refund = await this.refundModel.findById(refundId).exec();
    if (!refund) throw new NotFoundException('Refund request not found.');

    refund.status = 'REJECTED';
    refund.rejectionReason = dto.rejectionReason;
    refund.processedAt = new Date();
    refund.processedBy = adminUser?.email || 'admin';
    await refund.save();

    await this.auditModel.create({
      action: 'REJECT_REFUND',
      performedBy: adminUser?.email || 'admin',
      entityType: 'REFUND',
      entityId: refundId,
      newState: { status: 'REJECTED', reason: dto.rejectionReason },
      notes: `Rejected refund ${refund.refundNumber}`,
    });

    return refund;
  }
}
