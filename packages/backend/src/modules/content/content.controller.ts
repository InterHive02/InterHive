import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { Public } from '../../core/decorators/public.decorator';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '@interhive/shared';

@ApiTags('Landing Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // ─────────────────── Public Endpoints ───────────────────

  @Public()
  @Get('testimonials')
  @ApiOperation({ summary: 'Get published testimonials for landing page' })
  async getPublicTestimonials() {
    const data = await this.contentService.getPublishedTestimonials();
    return { success: true, data };
  }

  @Public()
  @Get('partners')
  @ApiOperation({ summary: 'Get active partner companies for landing page' })
  async getPublicPartners() {
    const data = await this.contentService.getActivePartners();
    return { success: true, data };
  }

  // ─────────────────── Admin Testimonials Endpoints ───────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/testimonials')
  @ApiOperation({ summary: '[Admin] Get all testimonials' })
  async getAdminTestimonials() {
    const data = await this.contentService.getAllTestimonials();
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('admin/testimonials')
  @ApiOperation({ summary: '[Admin] Create a testimonial' })
  async createTestimonial(@Body() body: any) {
    const data = await this.contentService.createTestimonial(body);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/testimonials/:id')
  @ApiOperation({ summary: '[Admin] Update a testimonial' })
  async updateTestimonial(@Param('id') id: string, @Body() body: any) {
    const data = await this.contentService.updateTestimonial(id, body);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete('admin/testimonials/:id')
  @ApiOperation({ summary: '[Admin] Delete a testimonial' })
  async deleteTestimonial(@Param('id') id: string) {
    const data = await this.contentService.deleteTestimonial(id);
    return { success: true, data };
  }

  // ─────────────────── Admin Partners Endpoints ───────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/partners')
  @ApiOperation({ summary: '[Admin] Get all partner companies' })
  async getAdminPartners() {
    const data = await this.contentService.getAllPartners();
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('admin/partners')
  @ApiOperation({ summary: '[Admin] Create a partner company' })
  async createPartner(@Body() body: any) {
    const data = await this.contentService.createPartner(body);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/partners/:id')
  @ApiOperation({ summary: '[Admin] Update a partner company' })
  async updatePartner(@Param('id') id: string, @Body() body: any) {
    const data = await this.contentService.updatePartner(id, body);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete('admin/partners/:id')
  @ApiOperation({ summary: '[Admin] Delete a partner company' })
  async deletePartner(@Param('id') id: string) {
    const data = await this.contentService.deletePartner(id);
    return { success: true, data };
  }
}
