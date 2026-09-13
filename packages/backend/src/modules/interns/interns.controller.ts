import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { InternsService } from './interns.service';
import { CreateInternProfileDto } from './dto/create-intern-profile.dto';
import { UpdateInternProfileDto } from './dto/update-intern-profile.dto';
import { InternReadinessDto } from './dto/intern-readiness.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UserRole } from '@interhive/shared';
import { User } from '../users/schemas/user.schema';

@ApiTags('Interns')
@Controller('interns')
@ApiBearerAuth()
export class InternsController {
  constructor(private readonly internsService: InternsService) {}

  @Post('profile')
  @ApiOperation({ summary: 'Create intern profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  async createProfile(
    @CurrentUser() user: User,
    @Body() createProfileDto: CreateInternProfileDto,
  ) {
    return this.internsService.createProfile(user.id, createProfileDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current intern profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfile(@CurrentUser() user: User) {
    if (!user) {
      return { success: true, data: null };
    }
    const userIdStr = (user as any)._id?.toString() || (user as any).id;
    if (!userIdStr) {
      return { success: true, data: null };
    }
    return this.internsService.getProfile(userIdStr);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update intern profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateInternProfileDto,
  ) {
    return this.internsService.updateProfile(user.id, updateProfileDto);
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Get intern readiness score' })
  @ApiResponse({ status: 200, description: 'Readiness score retrieved successfully' })
  async getReadiness(@CurrentUser() user: User) {
    return this.internsService.getReadiness(user.id);
  }

  @Post('applications')
  @ApiOperation({ summary: 'Apply for internship program' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async apply(
    @CurrentUser() user: User,
    @Body('programId') programId: string,
    @Body('coverLetter') coverLetter?: string,
  ) {
    return this.internsService.apply(user.id, programId, coverLetter);
  }

  @Get('applications')
  @ApiOperation({ summary: 'Get intern applications' })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  async getApplications(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return this.internsService.getApplications(user.id, status);
  }

  @Get('applications/:applicationId')
  @ApiOperation({ summary: 'Get application details' })
  @ApiResponse({ status: 200, description: 'Application details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async getApplication(
    @CurrentUser() user: User,
    @Param('applicationId') applicationId: string,
  ) {
    return this.internsService.getApplication(user.id, applicationId);
  }

  @Post('applications/:applicationId/withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Withdraw application' })
  @ApiResponse({ status: 200, description: 'Application withdrawn successfully' })
  @ApiResponse({ status: 400, description: 'Cannot withdraw application' })
  async withdrawApplication(
    @CurrentUser() user: User,
    @Param('applicationId') applicationId: string,
  ) {
    return this.internsService.withdrawApplication(user.id, applicationId);
  }

  @Get('opportunities')
  @ApiOperation({ summary: 'Get matched opportunities' })
  @ApiResponse({ status: 200, description: 'Opportunities retrieved successfully' })
  async getOpportunities(
    @CurrentUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.internsService.getOpportunities(user.id, page, limit);
  }

  @Post('onboard')
  @ApiOperation({ summary: 'Onboard intern to program' })
  @ApiResponse({ status: 200, description: 'Intern onboarded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async onboard(
    @CurrentUser() user: User,
    @Body('programId') programId: string,
  ) {
    return this.internsService.onboard(user.id, programId);
  }

  // Admin/Manager endpoints
  @Get('all')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all interns (admin/manager)' })
  @ApiResponse({ status: 200, description: 'Interns retrieved successfully' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.internsService.findAll({ page, limit, status, search });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get intern by ID' })
  @ApiResponse({ status: 200, description: 'Intern retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Intern not found' })
  async findById(@Param('id') id: string) {
    return this.internsService.findById(id);
  }

  @Post(':id/readiness/recalculate')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Recalculate intern readiness score' })
  @ApiResponse({ status: 200, description: 'Readiness score recalculated successfully' })
  async recalculateReadiness(@Param('id') id: string) {
    return this.internsService.recalculateReadiness(id);
  }

  @Post(':id/status')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Update intern status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.internsService.updateStatus(id, status);
  }

  @Post('upload-resume')
  @UseInterceptors(FileInterceptor('resume'))
  @ApiOperation({ summary: 'Upload resume' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Resume uploaded successfully' })
  async uploadResume(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.internsService.uploadResume(user.id, file);
  }

  @Delete('resume')
  @ApiOperation({ summary: 'Delete resume' })
  @ApiResponse({ status: 200, description: 'Resume deleted successfully' })
  async deleteResume(@CurrentUser() user: User) {
    return this.internsService.deleteResume(user.id);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get intern statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.internsService.getStats();
  }
}