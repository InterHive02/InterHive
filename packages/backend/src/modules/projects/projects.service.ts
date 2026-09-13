import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { ProjectTask, ProjectTaskDocument } from './schemas/project-task.schema';
import { ProjectUpload, ProjectUploadDocument } from './schemas/project-upload.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UsersService } from '../users/users.service';
import { InternsService } from '../interns/interns.service';
import { CompaniesService } from '../companies/companies.service';
import { RedisService } from '../../common/redis/redis.service';
import { MailService } from '../../common/mail/mail.service';
import { ProjectStatus, TaskStatus } from '@interhive/shared';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(ProjectTask.name) private taskModel: Model<ProjectTaskDocument>,
    @InjectModel(ProjectUpload.name) private uploadModel: Model<ProjectUploadDocument>,
    private usersService: UsersService,
    private internsService: InternsService,
    private companiesService: CompaniesService,
    private redisService: RedisService,
    private mailService: MailService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const { tasks, ...projectData } = createProjectDto;

    // Create project
    const project = new this.projectModel({
      ...projectData,
      status: ProjectStatus.PLANNING,
      phase: 'initiation',
      progress: 0,
    });

    await project.save();

    // Create tasks
    const createdTasks = await Promise.all(
      tasks.map(async (task) => {
        const projectTask = new this.taskModel({
          projectId: project.id,
          ...task,
          status: TaskStatus.TO_DO,
        });
        return projectTask.save();
      }),
    );

    project.tasks = createdTasks.map(t => t.id);
    await project.save();

    // Send notifications to assigned interns
    if (project.assignedTo && project.assignedTo.length > 0) {
      await this.mailService.sendProjectAssignmentEmail(
        String(project.assignedTo),
        project.title,
        String(project.id),
      );
    }

    return {
      success: true,
      message: 'Project created successfully',
      data: {
        project,
        tasks: createdTasks,
      },
    };
  }

  async findAll(params: {
    page: number;
    limit: number;
    status?: string;
    companyId?: string;
    assignedTo?: string;
    search?: string;
  }) {
    const { page, limit, status, companyId, assignedTo, search } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) query.status = status;
    if (companyId) query.companyId = companyId;
    if (assignedTo) query.assignedTo = { $in: [assignedTo] };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $in: [search] } },
      ];
    }

    const [projects, total] = await Promise.all([
      this.projectModel
        .find(query)
        .populate('companyId', 'companyInfo.name companyInfo.logo')
        .populate('assignedTo', 'firstName lastName email')
        .populate('mentors', 'firstName lastName email')
        .populate('tasks')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.projectModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: projects,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getMyProjects(userId: string, status?: string) {
    const query: any = {
      assignedTo: { $in: [userId] },
    };
    if (status) query.status = status;

    const projects = await this.projectModel
      .find(query)
      .populate('companyId', 'companyInfo.name companyInfo.logo')
      .populate('mentors', 'firstName lastName email')
      .populate('tasks')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: projects,
    };
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Project not found');
    }

    const project = await this.projectModel
      .findById(id)
      .populate('companyId', 'companyInfo.name companyInfo.logo companyInfo.description')
      .populate('assignedTo', 'firstName lastName email profilePhoto')
      .populate('mentors', 'firstName lastName email profilePhoto')
      .populate('tasks');

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      success: true,
      data: project,
    };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    Object.assign(project, updateProjectDto);
    await project.save();

    return {
      success: true,
      message: 'Project updated successfully',
      data: project,
    };
  }

  async delete(id: string) {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Delete associated tasks and uploads
    await this.taskModel.deleteMany({ projectId: id });
    await this.uploadModel.deleteMany({ projectId: id });
    await project.deleteOne();

    return {
      success: true,
      message: 'Project deleted successfully',
    };
  }

  async assignInterns(projectId: string, internIds: string[]) {
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.assignedTo = internIds.map(id => new Types.ObjectId(id));
    await project.save();

    // Send notifications
    await this.mailService.sendProjectAssignmentEmail(
      String(internIds),
      project.title,
      projectId,
    );

    return {
      success: true,
      message: 'Interns assigned successfully',
      data: project,
    };
  }

  async startProject(id: string) {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.assignedTo.length === 0) {
      throw new BadRequestException('Cannot start project without assigned interns');
    }

    project.status = ProjectStatus.IN_PROGRESS;
    project.phase = 'execution';
    project.startDate = new Date();
    await project.save();

    return {
      success: true,
      message: 'Project started successfully',
      data: project,
    };
  }

  async completeProject(id: string) {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if all tasks are completed
    const incompleteTasks = await this.taskModel.countDocuments({
      projectId: id,
      status: { $ne: TaskStatus.COMPLETED },
    });

    if (incompleteTasks > 0) {
      throw new BadRequestException('Cannot complete project with incomplete tasks');
    }

    project.status = ProjectStatus.COMPLETED;
    project.phase = 'closure';
    project.progress = 100;
    project.completedDate = new Date();
    await project.save();

    // Update intern readiness
    for (const internId of project.assignedTo) {
      await this.internsService.recalculateReadiness(internId.toString());
    }

    return {
      success: true,
      message: 'Project completed successfully',
      data: project,
    };
  }

  async createTask(projectId: string, createTaskDto: any) {
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const task = new this.taskModel({
      projectId,
      ...createTaskDto,
      status: TaskStatus.TO_DO,
    });

    await task.save();

    project.tasks.push(task.id);
    await project.save();

    return {
      success: true,
      message: 'Task created successfully',
      data: task,
    };
  }

  async updateTask(taskId: string, updateTaskDto: any) {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, updateTaskDto);
    await task.save();

    return {
      success: true,
      message: 'Task updated successfully',
      data: task,
    };
  }

  async updateTaskStatus(taskId: string, status: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.status = status as TaskStatus;

    if (status === TaskStatus.COMPLETED) {
      task.completedAt = new Date();
    }

    await task.save();

    // Update project progress
    await this.updateProjectProgress(task.projectId.toString());

    return {
      success: true,
      message: 'Task status updated successfully',
      data: task,
    };
  }

  async deleteTask(taskId: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await task.deleteOne();

    return {
      success: true,
      message: 'Task deleted successfully',
    };
  }

  async uploadFiles(
    userId: string,
    projectId: string,
    files: Express.Multer.File[],
    taskId?: string,
  ) {
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const uploads = await Promise.all(
      files.map(async (file) => {
        const upload = new this.uploadModel({
          projectId,
          taskId: taskId || null,
          uploadedBy: userId,
          fileName: file.originalname,
          fileSize: file.size,
          fileType: file.mimetype,
          fileUrl: file.path || file.filename,
          uploadDate: new Date(),
        });
        return upload.save();
      }),
    );

    return {
      success: true,
      message: 'Files uploaded successfully',
      data: uploads,
    };
  }

  async getUploads(projectId: string, taskId?: string) {
    const query: any = { projectId };
    if (taskId) query.taskId = taskId;

    const uploads = await this.uploadModel
      .find(query)
      .populate('uploadedBy', 'firstName lastName email')
      .sort({ uploadDate: -1 });

    return {
      success: true,
      data: uploads,
    };
  }

  async deleteUpload(userId: string, uploadId: string) {
    const upload = await this.uploadModel.findById(uploadId);
    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    // Check if user is the uploader or admin
    const user = await this.usersService.findById(userId);
    if (upload.uploadedBy.toString() !== userId && user.data.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to delete this upload');
    }

    await upload.deleteOne();

    return {
      success: true,
      message: 'Upload deleted successfully',
    };
  }

  async getStats() {
    const [
      total,
      byStatus,
      byCategory,
      totalTasks,
      completedTasks,
      avgProgress,
    ] = await Promise.all([
      this.projectModel.countDocuments(),
      this.projectModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.projectModel.aggregate([
        { $unwind: '$category' },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      this.taskModel.countDocuments(),
      this.taskModel.countDocuments({ status: TaskStatus.COMPLETED }),
      this.projectModel.aggregate([
        { $group: { _id: null, average: { $avg: '$progress' } } },
      ]),
    ]);

    return {
      success: true,
      data: {
        total: total,
        byStatus,
        byCategory,
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
        averageProgress: avgProgress[0]?.average || 0,
      },
    };
  }

  private async updateProjectProgress(projectId: string) {
    const tasks = await this.taskModel.find({ projectId });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await this.projectModel.findByIdAndUpdate(projectId, { progress });
  }
}