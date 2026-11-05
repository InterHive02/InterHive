import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralService } from '../services/referral.service';
import { Public } from '../../../core/decorators/public.decorator';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';

@ApiTags('Referrals')
@Controller('referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my-code')
  @ApiOperation({ summary: 'Get current student referral code, rewards balance & history' })
  async getMyReferralCode(@Req() req: any) {
    const studentId = req.user.id;
    const studentName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Student';
    const data = await this.referralService.getStudentReferralInfo(studentId, studentName);
    return { success: true, data };
  }

  @Public()
  @Post('validate')
  @ApiOperation({ summary: 'Validate student referral code for discount' })
  async validateCode(@Body('code') code: string, @Body('studentId') studentId?: string) {
    const data = await this.referralService.validateReferralCode(code, studentId);
    return { success: true, message: 'Referral discount applied.', data };
  }
}
