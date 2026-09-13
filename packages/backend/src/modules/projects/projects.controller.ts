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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UserRole } from '@interhive/shared';
import { User } from '../users/schemas/user.schema';

@ApiTags('Projects')
@Controller('projects')
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('companyId') companyId?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('search') search?: string,
  ) {
    return this.projectsService.findAll({ page, limit, status, companyId, assignedTo, search });
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my projects' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async getMyProjects(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    if (!user) {
      return { success: true, data: [] };
    }
    const userId = (user as any)?._id?.toString() || (user as any)?.id || '';
    if (!userId) {
      return { success: true, data: [] };
    }
    return this.projectsService.getMyProjects(userId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findById(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 204, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async delete(@Param('id') id: string) {
    await this.projectsService.delete(id);
  }

  @Post(':id/assign')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Assign interns to project' })
  @ApiResponse({ status: 200, description: 'Interns assigned successfully' })
  async assignInterns(
    @Param('id') id: string,
    @Body('internIds') internIds: string[],
  ) {
    return this.projectsService.assignInterns(id, internIds);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start project' })
  @ApiResponse({ status: 200, description: 'Project started successfully' })
  async startProject(@Param('id') id: string) {
    return this.projectsService.startProject(id);
  }

  @Post(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Complete project' })
  @ApiResponse({ status: 200, description: 'Project completed successfully' })
  async completeProject(@Param('id') id: string) {
    return this.projectsService.completeProject(id);
  }

  // Tasks
  @Post(':projectId/tasks')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create task for project' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async createTask(
    @Param('projectId') projectId: string,
    @Body() createTaskDto: any,
  ) {
    return this.projectsService.createTask(projectId, createTaskDto);
  }

  @Put('tasks/:taskId')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: any,
  ) {
    return this.projectsService.updateTask(taskId, updateTaskDto);
  }

  @Post('tasks/:taskId/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({ status: 200, description: 'Task status updated successfully' })
  async updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body('status') status: string,
  ) {
    return this.projectsService.updateTaskStatus(taskId, status);
  }

  @Delete('tasks/:taskId')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  async deleteTask(@Param('taskId') taskId: string) {
    await this.projectsService.deleteTask(taskId);
  }

  // Uploads
  @Post(':projectId/uploads')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Upload project files' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Files uploaded successfully' })
  async uploadFiles(
    @CurrentUser() user: User,
    @Param('projectId') projectId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('taskId') taskId?: string,
  ) {
    return this.projectsService.uploadFiles(user.id, projectId, files, taskId);
  }

  @Get(':projectId/uploads')
  @ApiOperation({ summary: 'Get project uploads' })
  @ApiResponse({ status: 200, description: 'Uploads retrieved successfully' })
  async getUploads(
    @Param('projectId') projectId: string,
    @Query('taskId') taskId?: string,
  ) {
    return this.projectsService.getUploads(projectId, taskId);
  }

  @Delete('uploads/:uploadId')
  @ApiOperation({ summary: 'Delete upload' })
  @ApiResponse({ status: 200, description: 'Upload deleted successfully' })
  async deleteUpload(
    @CurrentUser() user: User,
    @Param('uploadId') uploadId: string,
  ) {
    return this.projectsService.deleteUpload(user.id, uploadId);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get project statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.projectsService.getStats();
  }
}