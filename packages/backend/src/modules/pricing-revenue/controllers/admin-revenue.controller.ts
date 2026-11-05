import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { RevenueAnalyticsService } from '../services/revenue-analytics.service';
import { CampaignService } from '../services/campaign.service';
import { RefundService } from '../services/refund.service';
import { CreateCampaignDto, UpdateCampaignDto } from '../dto/campaign.dto';
import { CreateRefundDto, RejectRefundDto } from '../dto/refund.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { Roles } from '../../../core/decorators/roles.decorator';
import { UserRole } from '@interhive/shared';

@ApiTags('Admin Revenue & Operations')
@Controller('admin/revenue')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminRevenueController {
  constructor(
    private readonly analyticsService: RevenueAnalyticsService,
    private readonly campaignService: CampaignService,
    private readonly refundService: RefundService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.HR)
  @Get('overview')
  @ApiOperation({ summary: '[Admin/HR] Get comprehensive revenue analytics and KPIs' })
  async getOverview() {
    const data = await this.analyticsService.getOverview();
    return { success: true, data };
  }

  @Roles(UserRole.ADMIN, UserRole.HR)
  @Get('transactions')
  @ApiOperation({ summary: '[Admin/HR] Get searchable transactions and order ledger' })
  async getTransactions(
    @Query('status') status?: string,
    @Query('programKey') programKey?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.analyticsService.getTransactions({
      status,
      programKey,
      search,
      startDate,
      endDate,
    });
    return { success: true, data };
  }

  @Roles(UserRole.ADMIN)
  @Get('export')
  @ApiOperation({ summary: '[Admin] Export transactions ledger to CSV' })
  async exportCsv(@Res() res: Response) {
    const csv = await this.analyticsService.exportTransactionsCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=interhive_revenue_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csv);
  }

  // ─────────────────── Campaign Management ───────────────────

  @Roles(UserRole.ADMIN, UserRole.HR)
  @Get('campaigns')
  @ApiOperation({ summary: '[Admin/HR] Get all promotional campaigns' })
  async getCampaigns() {
    const data = await this.campaignService.getAllCampaigns();
    return { success: true, data };
  }

  @Roles(UserRole.ADMIN)
  @Post('campaigns')
  @ApiOperation({ summary: '[Admin] Create promotional campaign' })
  async createCampaign(@Body() dto: CreateCampaignDto, @Req() req: any) {
    const data = await this.campaignService.createCampaign(dto, req.user);
    return { success: true, message: 'Campaign created successfully.', data };
  }

  @Roles(UserRole.ADMIN)
  @Patch('campaigns/:id')
  @ApiOperation({ summary: '[Admin] Update promotional campaign' })
  async updateCampaign(@Param('id') id: string, @Body() dto: UpdateCampaignDto, @Req() req: any) {
    const data = await this.campaignService.updateCampaign(id, dto, req.user);
    return { success: true, message: 'Campaign updated successfully.', data };
  }

  // ─────────────────── Refund Management ───────────────────

  @Roles(UserRole.ADMIN, UserRole.HR)
  @Get('refunds')
  @ApiOperation({ summary: '[Admin/HR] Get all refund requests' })
  async getRefunds() {
    const data = await this.refundService.getAllRefunds();
    return { success: true, data };
  }

  @Roles(UserRole.ADMIN)
  @Post('refunds')
  @ApiOperation({ summary: '[Admin] Create new refund request' })
  async createRefund(@Body() dto: CreateRefundDto, @Req() req: any) {
    const data = await this.refundService.createRefundRequest(dto, req.user);
    return { success: true, message: 'Refund request created.', data };
  }

  @Roles(UserRole.ADMIN)
  @Post('refunds/:id/approve')
  @ApiOperation({ summary: '[Admin] Approve and process refund' })
  async approveRefund(@Param('id') id: string, @Req() req: any) {
    const data = await this.refundService.approveRefund(id, req.user);
    return { success: true, message: 'Refund processed successfully.', data };
  }

  @Roles(UserRole.ADMIN)
  @Post('refunds/:id/reject')
  @ApiOperation({ summary: '[Admin] Reject refund request' })
  async rejectRefund(@Param('id') id: string, @Body() dto: RejectRefundDto, @Req() req: any) {
    const data = await this.refundService.rejectRefund(id, dto, req.user);
    return { success: true, message: 'Refund request rejected.', data };
  }
}
