import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from '../schemas/coupon.schema';
import { CouponUsage, CouponUsageDocument } from '../schemas/coupon-usage.schema';
import { PricingAuditLog, PricingAuditLogDocument } from '../schemas/pricing-audit-log.schema';
import { CreateCouponDto, UpdateCouponDto } from '../dto/coupon.dto';
import { DEFAULT_COUPONS } from '@interhive/shared';

@Injectable()
export class CouponService implements OnModuleInit {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<CouponDocument>,
    @InjectModel(CouponUsage.name) private readonly usageModel: Model<CouponUsageDocument>,
    @InjectModel(PricingAuditLog.name) private readonly auditModel: Model<PricingAuditLogDocument>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.couponModel.countDocuments();
      if (count === 0) {
        for (const item of DEFAULT_COUPONS) {
          await this.couponModel.create(item);
        }
        console.log('[CouponService] Seeded default coupon codes.');
      }
    } catch (err) {
      console.warn('[CouponService] Error seeding coupons:', err.message);
    }
  }

  async getAllCoupons(filters?: any): Promise<Coupon[]> {
    const query: any = {};
    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    return this.couponModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async getCouponById(id: string): Promise<Coupon> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) {
      throw new NotFoundException(`Coupon with id '${id}' not found.`);
    }
    return coupon;
  }

  async validateCoupon(code: string, programKey: string, orderAmount: number, studentId?: string) {
    const normalizedCode = code.trim().toUpperCase();
    const coupon = await this.couponModel.findOne({ code: normalizedCode }).exec();

    if (!coupon) {
      throw new BadRequestException('Invalid coupon code.');
    }

    if (!coupon.isActive || coupon.isPaused) {
      throw new BadRequestException('This coupon code is currently inactive.');
    }

    const now = new Date();
    if (now < new Date(coupon.startDate)) {
      throw new BadRequestException('This coupon offer has not started yet.');
    }

    if (now > new Date(coupon.expiryDate)) {
      throw new BadRequestException('This coupon code has expired.');
    }

    if (coupon.usedCount >= coupon.totalUsageLimit) {
      throw new BadRequestException('This coupon usage limit has been reached.');
    }

    if (coupon.applicablePrograms && coupon.applicablePrograms.length > 0) {
      if (!coupon.applicablePrograms.includes(programKey)) {
        throw new BadRequestException('This coupon is not applicable to the selected program.');
      }
    }

    if (coupon.minOrderValue && orderAmount < coupon.minOrderValue) {
      throw new BadRequestException(
        `Minimum purchase requirement not met. This coupon requires a minimum order of ₹${coupon.minOrderValue.toLocaleString('en-IN')}.`,
      );
    }

    if (studentId) {
      const userUsageCount = await this.usageModel.countDocuments({
        couponCode: normalizedCode,
        studentId,
      });

      if (userUsageCount >= coupon.perUserLimit) {
        throw new BadRequestException('You have already reached the maximum usage limit for this coupon.');
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.round((orderAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount > 0 && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, orderAmount);

    return {
      isValid: true,
      couponId: coupon._id.toString(),
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      allowStacking: coupon.allowStacking,
    };
  }

  async recordUsage(couponId: string, code: string, studentId: string, orderId: any, discountAmount: number) {
    await this.couponModel.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
    await this.usageModel.create({
      couponId,
      couponCode: code.toUpperCase(),
      studentId,
      orderId,
      discountAmount,
      usedAt: new Date(),
    });
  }

  async createCoupon(dto: CreateCouponDto, adminUser: any): Promise<Coupon> {
    const normalizedCode = dto.code.trim().toUpperCase();
    const existing = await this.couponModel.findOne({ code: normalizedCode }).exec();
    if (existing) {
      throw new BadRequestException(`Coupon with code '${normalizedCode}' already exists.`);
    }

    const created = await this.couponModel.create({
      ...dto,
      code: normalizedCode,
      usedCount: 0,
    });

    await this.auditModel.create({
      action: 'CREATE_COUPON',
      performedBy: adminUser?.email || 'admin',
      entityType: 'COUPON',
      entityId: created._id.toString(),
      newState: dto,
      notes: `Created coupon ${normalizedCode}`,
    });

    return created;
  }

  async updateCoupon(id: string, dto: UpdateCouponDto, adminUser: any): Promise<Coupon> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) {
      throw new NotFoundException(`Coupon not found.`);
    }

    const previousState = coupon.toObject();
    const updated = await this.couponModel.findByIdAndUpdate(id, dto, { new: true }).exec();

    await this.auditModel.create({
      action: 'UPDATE_COUPON',
      performedBy: adminUser?.email || 'admin',
      entityType: 'COUPON',
      entityId: id,
      previousState,
      newState: updated.toObject(),
      notes: `Updated coupon ${coupon.code}`,
    });

    return updated;
  }

  async togglePause(id: string, isPaused: boolean, adminUser: any): Promise<Coupon> {
    const updated = await this.couponModel.findByIdAndUpdate(id, { isPaused }, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('Coupon not found.');
    }

    await this.auditModel.create({
      action: isPaused ? 'PAUSE_COUPON' : 'RESUME_COUPON',
      performedBy: adminUser?.email || 'admin',
      entityType: 'COUPON',
      entityId: id,
      notes: `Set isPaused to ${isPaused}`,
    });

    return updated;
  }

  async deleteCoupon(id: string, adminUser: any): Promise<{ success: boolean; message: string }> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) {
      throw new NotFoundException('Coupon not found.');
    }

    // Only allow deletion if never used; otherwise deactivate it to preserve history
    if (coupon.usedCount > 0) {
      await this.couponModel.findByIdAndUpdate(id, { isActive: false }).exec();
      return {
        success: true,
        message: 'Coupon has existing usage records, deactivated instead of hard deleting to preserve transaction integrity.',
      };
    }

    await this.couponModel.findByIdAndDelete(id).exec();

    await this.auditModel.create({
      action: 'DELETE_COUPON',
      performedBy: adminUser?.email || 'admin',
      entityType: 'COUPON',
      entityId: id,
      notes: `Deleted coupon ${coupon.code}`,
    });

    return { success: true, message: 'Coupon deleted successfully.' };
  }
}
