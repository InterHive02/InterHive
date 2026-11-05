import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CheckoutService } from '../services/checkout.service';
import { PaymentService } from '../services/payment.service';
import { CheckoutPreviewDto, CreateOrderDto } from '../dto/checkout.dto';
import { Public } from '../../../core/decorators/public.decorator';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';

@ApiTags('Checkout & Orders')
@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly paymentService: PaymentService,
  ) {}

  @Public()
  @Post('preview')
  @ApiOperation({ summary: 'Preview checkout price calculation with discounts and tax' })
  async previewCheckout(@Body() dto: CheckoutPreviewDto, @Req() req: any) {
    const studentId = req?.user?.id;
    const data = await this.checkoutService.previewCheckout(dto, studentId);
    return { success: true, data };
  }

  @Public()
  @Post('create-order')
  @ApiOperation({ summary: 'Create immutable order and initialize Razorpay gateway transaction' })
  async createOrder(@Body() dto: CreateOrderDto, @Req() req: any) {
    const studentId = req?.user?.id;
    const order = await this.checkoutService.createOrder(dto, studentId);
    const paymentInit = await this.paymentService.initializePayment((order as any)._id.toString());

    return {
      success: true,
      message: 'Order created and payment gateway initialized.',
      data: {
        order,
        gateway: paymentInit,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my-orders')
  @ApiOperation({ summary: 'Get current user order history' })
  async getMyOrders(@Req() req: any) {
    const email = req.user.email;
    const studentId = req.user.id;
    const data = await this.checkoutService.getMyOrders(email, studentId);
    return { success: true, data };
  }

  @Public()
  @Get('orders/:id')
  @ApiOperation({ summary: 'Get order details by order ID' })
  async getOrderById(@Param('id') id: string) {
    const data = await this.checkoutService.getOrderById(id);
    return { success: true, data };
  }
}
