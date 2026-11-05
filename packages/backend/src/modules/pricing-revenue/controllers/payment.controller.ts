import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { VerifyPaymentDto } from '../dto/payment.dto';
import { Public } from '../../../core/decorators/public.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Post('verify')
  @ApiOperation({ summary: 'Verify Razorpay HMAC signature and activate student program entitlement' })
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    const res = await this.paymentService.verifyPayment(dto);
    return {
      success: true,
      message: res.message,
      data: res.order,
    };
  }

  @Public()
  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Razorpay webhook callback endpoint' })
  async handleWebhook(@Body() body: any, @Headers('x-razorpay-signature') signature: string) {
    return this.paymentService.handleWebhook(body, signature);
  }
}
