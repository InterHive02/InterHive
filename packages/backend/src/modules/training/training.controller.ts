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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { EnrollTrainingDto } from './dto/enroll-training.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UserRole } from '@interhive/shared';
import { User } from '../users/schemas/user.schema';

@ApiTags('Training')
@Controller('training')
@ApiBearerAuth()
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Create a training program' })
  @ApiResponse({ status: 201, description: 'Training program created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createTrainingDto: CreateTrainingDto) {
    return this.trainingService.create(createTrainingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all training programs' })
  @ApiResponse({ status: 200, description: 'Training programs retrieved successfully' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.trainingService.findAll({ page, limit, status, category, search });
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available training programs for enrollment' })
  @ApiResponse({ status: 200, description: 'Available training programs retrieved successfully' })
  async getAvailable(@CurrentUser() user: User) {
    return this.trainingService.getAvailable(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get training program by ID' })
  @ApiResponse({ status: 200, description: 'Training program retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Training program not found' })
  async findById(@Param('id') id: string) {
    return this.trainingService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Update training program' })
  @ApiResponse({ status: 200, description: 'Training program updated successfully' })
  @ApiResponse({ status: 404, description: 'Training program not found' })
  async update(@Param('id') id: string, @Body() updateTrainingDto: any) {
    return this.trainingService.update(id, updateTrainingDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete training program' })
  @ApiResponse({ status: 204, description: 'Training program deleted successfully' })
  @ApiResponse({ status: 404, description: 'Training program not found' })
  async delete(@Param('id') id: string) {
    await this.trainingService.delete(id);
  }

  @Post(':id/publish')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Publish training program' })
  @ApiResponse({ status: 200, description: 'Training program published successfully' })
  async publish(@Param('id') id: string) {
    return this.trainingService.publish(id);
  }

  // Enrollment
  @Post(':id/enroll')
  @ApiOperation({ summary: 'Enroll in a training program' })
  @ApiResponse({ status: 201, description: 'Enrolled successfully' })
  @ApiResponse({ status: 400, description: 'Cannot enroll' })
  async enroll(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() enrollTrainingDto: EnrollTrainingDto,
  ) {
    return this.trainingService.enroll(user.id, id, enrollTrainingDto);
  }

  @Get('my-enrollments')
  @ApiOperation({ summary: 'Get my training enrollments' })
  @ApiResponse({ status: 200, description: 'Enrollments retrieved successfully' })
  async getMyEnrollments(@CurrentUser() user: User) {
    return this.trainingService.getMyEnrollments(user.id);
  }

  @Get('enrollments/:enrollmentId')
  @ApiOperation({ summary: 'Get enrollment details' })
  @ApiResponse({ status: 200, description: 'Enrollment details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  async getEnrollment(@CurrentUser() user: User, @Param('enrollmentId') enrollmentId: string) {
    return this.trainingService.getEnrollment(user.id, enrollmentId);
  }

  @Post('enrollments/:enrollmentId/progress')
  @ApiOperation({ summary: 'Update enrollment progress' })
  @ApiResponse({ status: 200, description: 'Progress updated successfully' })
  async updateProgress(
    @CurrentUser() user: User,
    @Param('enrollmentId') enrollmentId: string,
    @Body('moduleId') moduleId: string,
    @Body('progress') progress: number,
  ) {
    return this.trainingService.updateProgress(user.id, enrollmentId, moduleId, progress);
  }

  @Post('enrollments/:enrollmentId/complete')
  @ApiOperation({ summary: 'Complete a training program' })
  @ApiResponse({ status: 200, description: 'Training program completed successfully' })
  async completeEnrollment(@CurrentUser() user: User, @Param('enrollmentId') enrollmentId: string) {
    return this.trainingService.completeEnrollment(user.id, enrollmentId);
  }

  @Post('enrollments/:enrollmentId/withdraw')
  @ApiOperation({ summary: 'Withdraw from training program' })
  @ApiResponse({ status: 200, description: 'Withdrawn successfully' })
  async withdrawEnrollment(@CurrentUser() user: User, @Param('enrollmentId') enrollmentId: string) {
    return this.trainingService.withdrawEnrollment(user.id, enrollmentId);
  }

  // Admin/Manager endpoints
  @Get('enrollments/all')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all enrollments' })
  @ApiResponse({ status: 200, description: 'Enrollments retrieved successfully' })
  async getAllEnrollments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('programId') programId?: string,
  ) {
    return this.trainingService.getAllEnrollments({ page, limit, status, programId });
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get training statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.trainingService.getStats();
  }
}