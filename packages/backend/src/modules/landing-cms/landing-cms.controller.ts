import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { LandingCmsService } from './landing-cms.service';
import { Public } from '../../core/decorators/public.decorator';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '@interhive/shared';

@ApiTags('Landing CMS')
@Controller('landing-cms')
export class LandingCmsController {
  constructor(private readonly cmsService: LandingCmsService) {}

  // ─────────────────── Public Endpoints ───────────────────

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Get active published landing page configuration' })
  @ApiResponse({ status: 200, description: 'Published landing page config' })
  async getPublicConfig() {
    const data = await this.cmsService.getPublishedConfig();
    return { success: true, data };
  }

  // ─────────────────── Admin-Only Endpoints ───────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('draft')
  @ApiOperation({ summary: '[Admin] Get current draft configuration' })
  async getDraftConfig() {
    const data = await this.cmsService.getDraftConfig();
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Put('draft')
  @ApiOperation({ summary: '[Admin] Save landing page draft changes' })
  async saveDraft(@Body() body: any, @Req() req: any) {
    const userEmail = req.user?.email || 'admin';
    const data = await this.cmsService.saveDraft(body, userEmail);
    return { success: true, message: 'Draft saved successfully', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('publish')
  @ApiOperation({ summary: '[Admin] Publish draft to live public landing page' })
  async publishDraft(@Body('notes') notes: string, @Req() req: any) {
    const userEmail = req.user?.email || 'admin';
    const result = await this.cmsService.publishDraft(userEmail, notes);
    return { success: true, message: `Version ${result.version} published live!`, data: result.config };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('revisions')
  @ApiOperation({ summary: '[Admin] Get landing page revision history' })
  async getRevisions() {
    const data = await this.cmsService.getRevisions();
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('revisions/:id/restore')
  @ApiOperation({ summary: '[Admin] Restore an earlier published revision' })
  async restoreRevision(@Param('id') id: string, @Req() req: any) {
    const userEmail = req.user?.email || 'admin';
    const data = await this.cmsService.restoreRevision(id, userEmail);
    return { success: true, message: 'Revision restored and published successfully', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('reset')
  @ApiOperation({ summary: '[Admin] Reset landing page configuration to code defaults' })
  async resetToDefaults(@Req() req: any) {
    const userEmail = req.user?.email || 'admin';
    const data = await this.cmsService.resetToDefaults(userEmail);
    return { success: true, message: 'Landing page reset to defaults successfully', data };
  }

  // ─────────────────── Media Library Endpoints ───────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('media')
  @ApiOperation({ summary: '[Admin] List media library assets' })
  async getMediaList() {
    const data = await this.cmsService.getMediaList();
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('media')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          return callback(
            new BadRequestException('Only image files (JPG, PNG, GIF, WebP, SVG) under 8MB are permitted'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiOperation({ summary: '[Admin] Upload new media asset' })
  @ApiConsumes('multipart/form-data')
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body('altText') altText: string,
    @Req() req: any,
  ) {
    const userEmail = req.user?.email || 'admin';
    const asset = await this.cmsService.uploadMedia(file, altText, userEmail);
    return { success: true, message: 'Media uploaded successfully', data: asset };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete('media/:id')
  @ApiOperation({ summary: '[Admin] Delete media asset' })
  async deleteMedia(@Param('id') id: string) {
    return this.cmsService.deleteMedia(id);
  }
}
