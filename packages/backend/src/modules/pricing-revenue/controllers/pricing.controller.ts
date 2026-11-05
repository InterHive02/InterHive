import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PricingService } from '../services/pricing.service';
import { CreateProgramPricingDto, UpdateProgramPricingDto } from '../dto/pricing.dto';
import { Public } from '../../../core/decorators/public.decorator';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { Roles } from '../../../core/decorators/roles.decorator';
import { UserRole } from '@interhive/shared';

@ApiTags('Program Pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Public()
  @Get('programs')
  @ApiOperation({ summary: 'Get all active program pricing options (Public)' })
  async getActivePrograms() {
    const data = await this.pricingService.getAllPrograms(true);
    return { success: true, data };
  }

  @Public()
  @Get('programs/:key')
  @ApiOperation({ summary: 'Get specific program pricing by program key (Public)' })
  async getProgramByKey(@Param('key') key: string) {
    const data = await this.pricingService.getProgramByKey(key);
    return { success: true, data };
  }

  // ─────────────────── Admin Endpoints ───────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiBearerAuth()
  @Get('admin/programs')
  @ApiOperation({ summary: '[Admin/HR] Get all program pricing configurations' })
  async getAllProgramsAdmin() {
    const data = await this.pricingService.getAllPrograms(false);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('admin/programs')
  @ApiOperation({ summary: '[Admin] Create new program pricing' })
  async createProgram(@Body() dto: CreateProgramPricingDto, @Req() req: any) {
    const data = await this.pricingService.createProgramPricing(dto, req.user);
    return { success: true, message: 'Program pricing created successfully.', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/programs/:id')
  @ApiOperation({ summary: '[Admin] Update existing program pricing' })
  async updateProgram(@Param('id') id: string, @Body() dto: UpdateProgramPricingDto, @Req() req: any) {
    const data = await this.pricingService.updateProgramPricing(id, dto, req.user);
    return { success: true, message: 'Program pricing updated successfully.', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/programs/:id/toggle')
  @ApiOperation({ summary: '[Admin] Toggle program active status' })
  async toggleActive(@Param('id') id: string, @Body('isActive') isActive: boolean, @Req() req: any) {
    const data = await this.pricingService.toggleActive(id, isActive, req.user);
    return { success: true, message: `Program status updated to ${isActive ? 'active' : 'inactive'}.`, data };
  }
}
