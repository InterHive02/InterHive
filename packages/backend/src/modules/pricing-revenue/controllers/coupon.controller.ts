import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CouponService } from '../services/coupon.service';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from '../dto/coupon.dto';
import { Public } from '../../../core/decorators/public.decorator';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { Roles } from '../../../core/decorators/roles.decorator';
import { UserRole } from '@interhive/shared';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Public()
  @Post('validate')
  @ApiOperation({ summary: 'Validate coupon code and return discount amount' })
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    const data = await this.couponService.validateCoupon(
      dto.code,
      dto.programKey,
      dto.orderAmount,
      dto.studentId,
    );
    return { success: true, message: 'Coupon applied successfully.', data };
  }

  // ─────────────────── Admin Endpoints ───────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiBearerAuth()
  @Get('admin/list')
  @ApiOperation({ summary: '[Admin/HR] Get all coupons' })
  async getAllCoupons(@Query('isActive') isActive?: string) {
    const filters = isActive !== undefined ? { isActive: isActive === 'true' } : undefined;
    const data = await this.couponService.getAllCoupons(filters);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('admin')
  @ApiOperation({ summary: '[Admin] Create new coupon' })
  async createCoupon(@Body() dto: CreateCouponDto, @Req() req: any) {
    const data = await this.couponService.createCoupon(dto, req.user);
    return { success: true, message: 'Coupon created successfully.', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/:id')
  @ApiOperation({ summary: '[Admin] Update coupon' })
  async updateCoupon(@Param('id') id: string, @Body() dto: UpdateCouponDto, @Req() req: any) {
    const data = await this.couponService.updateCoupon(id, dto, req.user);
    return { success: true, message: 'Coupon updated successfully.', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/:id/pause')
  @ApiOperation({ summary: '[Admin] Pause or resume coupon' })
  async pauseCoupon(@Param('id') id: string, @Body('isPaused') isPaused: boolean, @Req() req: any) {
    const data = await this.couponService.togglePause(id, isPaused, req.user);
    return { success: true, message: `Coupon is now ${isPaused ? 'paused' : 'active'}.`, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete('admin/:id')
  @ApiOperation({ summary: '[Admin] Delete or deactivate coupon' })
  async deleteCoupon(@Param('id') id: string, @Req() req: any) {
    const res = await this.couponService.deleteCoupon(id, req.user);
    return { success: true, message: res.message };
  }
}
