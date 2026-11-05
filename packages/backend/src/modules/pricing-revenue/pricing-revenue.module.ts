import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import { ProgramPricing, ProgramPricingSchema } from './schemas/program-pricing.schema';
import { Coupon, CouponSchema } from './schemas/coupon.schema';
import { CouponUsage, CouponUsageSchema } from './schemas/coupon-usage.schema';
import { DiscountCampaign, DiscountCampaignSchema } from './schemas/discount-campaign.schema';
import { Order, OrderSchema } from './schemas/order.schema';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Refund, RefundSchema } from './schemas/refund.schema';
import { Referral, ReferralSchema } from './schemas/referral.schema';
import { PricingAuditLog, PricingAuditLogSchema } from './schemas/pricing-audit-log.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

// Services
import { PricingService } from './services/pricing.service';
import { CouponService } from './services/coupon.service';
import { CampaignService } from './services/campaign.service';
import { ReferralService } from './services/referral.service';
import { CheckoutService } from './services/checkout.service';
import { PaymentService } from './services/payment.service';
import { RefundService } from './services/refund.service';
import { RevenueAnalyticsService } from './services/revenue-analytics.service';

// Controllers
import { PricingController } from './controllers/pricing.controller';
import { CouponController } from './controllers/coupon.controller';
import { CheckoutController } from './controllers/checkout.controller';
import { PaymentController } from './controllers/payment.controller';
import { AdminRevenueController } from './controllers/admin-revenue.controller';
import { ReferralController } from './controllers/referral.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProgramPricing.name, schema: ProgramPricingSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: CouponUsage.name, schema: CouponUsageSchema },
      { name: DiscountCampaign.name, schema: DiscountCampaignSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Refund.name, schema: RefundSchema },
      { name: Referral.name, schema: ReferralSchema },
      { name: PricingAuditLog.name, schema: PricingAuditLogSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    PricingController,
    CouponController,
    CheckoutController,
    PaymentController,
    AdminRevenueController,
    ReferralController,
  ],
  providers: [
    PricingService,
    CouponService,
    CampaignService,
    ReferralService,
    CheckoutService,
    PaymentService,
    RefundService,
    RevenueAnalyticsService,
  ],
  exports: [
    PricingService,
    CouponService,
    CampaignService,
    CheckoutService,
    PaymentService,
    RefundService,
    RevenueAnalyticsService,
    ReferralService,
  ],
})
export class PricingRevenueModule {}
