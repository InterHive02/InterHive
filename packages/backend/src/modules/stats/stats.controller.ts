import { Controller, Get, Patch, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { UpdatePlatformStatDto } from './dto/update-platform-stat.dto';
import { Public } from '../../core/decorators/public.decorator';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '@interhive/shared';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  // ─────────────────── Public Endpoints ───────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get live platform statistics (legacy)' })
  @ApiResponse({ status: 200, description: 'Live platform statistics' })
  async getStats() {
    const data = await this.statsService.getPublicStats();
    return { success: true, data };
  }

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Get live platform statistics (alias)' })
  async getPublicStats() {
    const data = await this.statsService.getPublicStats();
    return { success: true, data };
  }

  /**
   * Public endpoint consumed by the landing page to render the 4 stat numbers.
   * Returns merged manual + live values per stat config.
   */
  @Public()
  @Get('landing')
  @ApiOperation({ summary: 'Get landing page stats (manual override aware)' })
  @ApiResponse({ status: 200, description: 'Landing page stats array' })
  async getLandingStats() {
    const data = await this.statsService.getLandingStats();
    return { success: true, data };
  }

  // ─────────────────── Admin-Only Endpoints ───────────────────

  /**
   * Admin: Get full stat config including manualValue, mode, last edit info.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/config')
  @ApiOperation({ summary: '[Admin] Get all stat configurations' })
  async getAdminStatConfigs() {
    const data = await this.statsService.getAllStatConfigs();
    return { success: true, data };
  }

  /**
   * Admin: Manually set a stat's value and/or switch its mode.
   * PATCH /api/v1/stats/admin/:key
   * Body: { manualValue?: number, useManualValue?: boolean, label?: string, suffix?: string }
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/:key')
  @ApiOperation({ summary: '[Admin] Update a specific stat manually' })
  async updateStat(
    @Param('key') key: string,
    @Body() dto: UpdatePlatformStatDto,
    @Req() req: any,
  ) {
    const editorEmail = req.user?.email;
    const data = await this.statsService.updateStat(key, dto, editorEmail);
    return { success: true, data };
  }

  /**
   * Admin: Sync all stats from system data (live DB counts).
   * Switches each stat to useManualValue = false and stores computed live value.
   * POST /api/v1/stats/admin/sync
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('admin/sync')
  @ApiOperation({ summary: '[Admin] Sync all stats from live system data' })
  async syncFromSystemData(@Req() req: any) {
    const editorEmail = req.user?.email;
    const data = await this.statsService.syncFromSystemData(editorEmail);
    return { success: true, message: 'Stats synced from system data.', data };
  }
}
