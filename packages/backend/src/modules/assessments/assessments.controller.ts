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

import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UserRole } from '@interhive/shared';
import { User } from '../users/schemas/user.schema';

@ApiTags('Assessments')
@Controller('assessments')
@ApiBearerAuth()
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Create a new assessment' })
  @ApiResponse({ status: 201, description: 'Assessment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createAssessmentDto: CreateAssessmentDto) {
    return this.assessmentsService.create(createAssessmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assessments' })
  @ApiResponse({ status: 200, description: 'Assessments retrieved successfully' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    return this.assessmentsService.findAll({ page, limit, type, category, status });
  }

  @Get('my-results')
  @ApiOperation({ summary: 'Get all assessment results for current user' })
  @ApiResponse({ status: 200, description: 'Results retrieved successfully' })
  async getMyResults(@CurrentUser() user: User) {
    return this.assessmentsService.getMyResults(user.id);
  }

  // Admin/Manager endpoints
  @Get('results/:userId')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get assessment results for a user' })
  @ApiResponse({ status: 200, description: 'Results retrieved successfully' })
  async getUserResults(@Param('userId') userId: string) {
    return this.assessmentsService.getUserResults(userId);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get assessment statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.assessmentsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assessment by ID' })
  @ApiResponse({ status: 200, description: 'Assessment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Assessment not found' })
  async findById(@Param('id') id: string) {
    return this.assessmentsService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Update assessment' })
  @ApiResponse({ status: 200, description: 'Assessment updated successfully' })
  @ApiResponse({ status: 404, description: 'Assessment not found' })
  async update(@Param('id') id: string, @Body() updateAssessmentDto: any) {
    return this.assessmentsService.update(id, updateAssessmentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete assessment' })
  @ApiResponse({ status: 204, description: 'Assessment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Assessment not found' })
  async delete(@Param('id') id: string) {
    await this.assessmentsService.delete(id);
  }

  @Post(':id/publish')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Publish assessment' })
  @ApiResponse({ status: 200, description: 'Assessment published successfully' })
  async publish(@Param('id') id: string) {
    return this.assessmentsService.publish(id);
  }

  // Assessment Taking
  @Post(':id/start')
  @ApiOperation({ summary: 'Start an assessment' })
  @ApiResponse({ status: 200, description: 'Assessment started successfully' })
  @ApiResponse({ status: 400, description: 'Cannot start assessment' })
  async startAssessment(@CurrentUser() user: User, @Param('id') id: string) {
    return this.assessmentsService.startAssessment(user.id, id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit assessment answers' })
  @ApiResponse({ status: 200, description: 'Assessment submitted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot submit assessment' })
  async submitAssessment(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() submitAssessmentDto: SubmitAssessmentDto,
  ) {
    return this.assessmentsService.submitAssessment(user.id, id, submitAssessmentDto);
  }

  @Get(':id/result')
  @ApiOperation({ summary: 'Get assessment result' })
  @ApiResponse({ status: 200, description: 'Assessment result retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Result not found' })
  async getResult(@CurrentUser() user: User, @Param('id') id: string) {
    return this.assessmentsService.getResult(user.id, id);
  }

  @Post(':id/evaluate')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Evaluate assessment manually' })
  @ApiResponse({ status: 200, description: 'Assessment evaluated successfully' })
  async evaluateAssessment(
    @Param('id') id: string,
    @Body('resultId') resultId: string,
    @Body('feedback') feedback: any,
  ) {
    return this.assessmentsService.evaluateAssessment(id, resultId, feedback);
  }
}