import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UserRole } from '@interhive/shared';
import { User } from '../users/schemas/user.schema';

@ApiTags('Analytics')
@Controller('analytics')
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard analytics' })
  @ApiResponse({ status: 200, description: 'Dashboard analytics retrieved successfully' })
  async getDashboardAnalytics(
    @CurrentUser() user: User,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getDashboardAnalytics(user, query);
  }

  @Get('readiness')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get readiness analytics' })
  @ApiResponse({ status: 200, description: 'Readiness analytics retrieved successfully' })
  async getReadinessAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getReadinessAnalytics(query);
  }

  @Get('readiness/:internId')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get intern readiness analytics' })
  @ApiResponse({ status: 200, description: 'Intern readiness analytics retrieved successfully' })
  async getInternReadinessAnalytics(@Param('internId') internId: string) {
    return this.analyticsService.getInternReadinessAnalytics(internId);
  }

  @Get('companies')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get company analytics' })
  @ApiResponse({ status: 200, description: 'Company analytics retrieved successfully' })
  async getCompanyAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getCompanyAnalytics(query);
  }

  @Get('companies/:companyId')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get specific company analytics' })
  @ApiResponse({ status: 200, description: 'Company analytics retrieved successfully' })
  async getCompanyAnalyticsById(@Param('companyId') companyId: string) {
    return this.analyticsService.getCompanyAnalyticsById(companyId);
  }

  @Get('projects')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get project analytics' })
  @ApiResponse({ status: 200, description: 'Project analytics retrieved successfully' })
  async getProjectAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getProjectAnalytics(query);
  }

  @Get('matching')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get matching analytics' })
  @ApiResponse({ status: 200, description: 'Matching analytics retrieved successfully' })
  async getMatchingAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getMatchingAnalytics(query);
  }

  @Get('trends')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get trend analytics' })
  @ApiResponse({ status: 200, description: 'Trend analytics retrieved successfully' })
  async getTrendAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getTrendAnalytics(query);
  }

  @Get('dashboard/activities')
  @ApiOperation({ summary: 'Get recent activities for dashboard' })
  @ApiResponse({ status: 200, description: 'Activities retrieved successfully' })
  async getDashboardActivities(@CurrentUser() user: User) {
    return this.analyticsService.getDashboardActivities(user?.id);
  }

  @Get('admin-dashboard')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get Super Administrator Central dashboard data' })
  async getAdminDashboard() {
    return this.analyticsService.getAdminDashboardData();
  }

  @Get('manager-dashboard')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get Operations & Training Management dashboard data' })
  async getManagerDashboard(@CurrentUser() user: User) {
    return this.analyticsService.getManagerDashboardData(user?.id);
  }

  @Get('company-dashboard')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.COMPANY)
  @ApiOperation({ summary: 'Get Company Dashboard data' })
  async getCompanyDashboard(@CurrentUser() user: User) {
    return this.analyticsService.getCompanyDashboardData(user?.id, user?.email);
  }

  @Patch('activity/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve or update platform activity status' })
  async updateActivityStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.analyticsService.updateActivityStatus(id, body.status);
  }

  @Post('diagnostics')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Run live system health diagnostics' })
  async runDiagnostics() {
    return this.analyticsService.runDiagnostics();
  }

  @Get('export/readiness')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Export readiness data' })
  @ApiResponse({ status: 200, description: 'Data exported successfully' })
  async exportReadinessData(@Res() response: Response) {
    const data = await this.analyticsService.exportReadinessData();
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Content-Disposition', 'attachment; filename=readiness-data.json');
    response.send(data);
  }

  @Get('export/companies')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Export company data' })
  @ApiResponse({ status: 200, description: 'Data exported successfully' })
  async exportCompanyData(@Res() response: Response) {
    const data = await this.analyticsService.exportCompanyData();
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Content-Disposition', 'attachment; filename=company-data.json');
    response.send(data);
  }

  @Post('cache/refresh')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Refresh analytics cache' })
  @ApiResponse({ status: 200, description: 'Cache refreshed successfully' })
  async refreshCache() {
    return this.analyticsService.refreshCache();
  }
}