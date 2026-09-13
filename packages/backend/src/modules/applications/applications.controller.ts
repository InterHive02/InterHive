import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import {
  CreateApplicationDto,
  ScheduleInterviewDto,
  AddNoteDto,
  UpdateStatusDto,
} from './dto/create-application.dto';
import { Public } from '../../core/decorators/public.decorator';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UserRole } from '@interhive/shared';
import { User } from '../users/schemas/user.schema';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Public submission of internship application' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  async create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all internship applications' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.applicationsService.findAll({ page, limit, status, search });
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get application pipeline statistics' })
  async getStats() {
    return this.applicationsService.getStats();
  }

  @Get('hr-dashboard')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get aggregated HR operations and training management dashboard data' })
  async getHrDashboard() {
    return this.applicationsService.getHrDashboardData();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single application details' })
  async findById(@Param('id') id: string) {
    return this.applicationsService.findById(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, updateStatusDto);
  }

  @Post(':id/interview')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Schedule or update interview for candidate' })
  async scheduleInterview(
    @Param('id') id: string,
    @Body() scheduleInterviewDto: ScheduleInterviewDto,
  ) {
    return this.applicationsService.scheduleInterview(id, scheduleInterviewDto);
  }

  @Post(':id/notes')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add internal HR note to application' })
  async addNote(
    @Param('id') id: string,
    @Body() addNoteDto: AddNoteDto,
    @CurrentUser() user: User,
  ) {
    const authorName = user
      ? `${user.firstName} ${user.lastName}`.trim()
      : 'HR Team';
    return this.applicationsService.addNote(id, addNoteDto, authorName);
  }

  @Post(':id/create-account')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Provision official Intern account and dispatch credentials via email',
  })
  async createInternAccount(@Param('id') id: string) {
    return this.applicationsService.createInternAccount(id);
  }

  @Post(':id/reject')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reject internship application and send rejection email with optional HR feedback',
  })
  async rejectApplication(
    @Param('id') id: string,
    @Body('feedback') feedback?: string,
  ) {
    return this.applicationsService.rejectApplication(id, feedback);
  }
}
