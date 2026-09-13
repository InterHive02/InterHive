"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_schema_1 = require("./schemas/project.schema");
const project_task_schema_1 = require("./schemas/project-task.schema");
const project_upload_schema_1 = require("./schemas/project-upload.schema");
const users_service_1 = require("../users/users.service");
const interns_service_1 = require("../interns/interns.service");
const companies_service_1 = require("../companies/companies.service");
const redis_service_1 = require("../../common/redis/redis.service");
const mail_service_1 = require("../../common/mail/mail.service");
const shared_1 = require("@interhive/shared");
let ProjectsService = class ProjectsService {
    constructor(projectModel, taskModel, uploadModel, usersService, internsService, companiesService, redisService, mailService) {
        this.projectModel = projectModel;
        this.taskModel = taskModel;
        this.uploadModel = uploadModel;
        this.usersService = usersService;
        this.internsService = internsService;
        this.companiesService = companiesService;
        this.redisService = redisService;
        this.mailService = mailService;
    }
    async create(createProjectDto) {
        const { tasks, ...projectData } = createProjectDto;
        const project = new this.projectModel({
            ...projectData,
            status: shared_1.ProjectStatus.PLANNING,
            phase: 'initiation',
            progress: 0,
        });
        await project.save();
        const createdTasks = await Promise.all(tasks.map(async (task) => {
            const projectTask = new this.taskModel({
                projectId: project.id,
                ...task,
                status: shared_1.TaskStatus.TO_DO,
            });
            return projectTask.save();
        }));
        project.tasks = createdTasks.map(t => t.id);
        await project.save();
        if (project.assignedTo && project.assignedTo.length > 0) {
            await this.mailService.sendProjectAssignmentEmail(String(project.assignedTo), project.title, String(project.id));
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
    async findAll(params) {
        const { page, limit, status, companyId, assignedTo, search } = params;
        const skip = (page - 1) * limit;
        const query = {};
        if (status)
            query.status = status;
        if (companyId)
            query.companyId = companyId;
        if (assignedTo)
            query.assignedTo = { $in: [assignedTo] };
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
    async getMyProjects(userId, status) {
        const query = {
            assignedTo: { $in: [userId] },
        };
        if (status)
            query.status = status;
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
    async findById(id) {
        const project = await this.projectModel
            .findById(id)
            .populate('companyId', 'companyInfo.name companyInfo.logo companyInfo.description')
            .populate('assignedTo', 'firstName lastName email profilePhoto')
            .populate('mentors', 'firstName lastName email profilePhoto')
            .populate('tasks');
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        return {
            success: true,
            data: project,
        };
    }
    async update(id, updateProjectDto) {
        const project = await this.projectModel.findById(id);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        Object.assign(project, updateProjectDto);
        await project.save();
        return {
            success: true,
            message: 'Project updated successfully',
            data: project,
        };
    }
    async delete(id) {
        const project = await this.projectModel.findById(id);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        await this.taskModel.deleteMany({ projectId: id });
        await this.uploadModel.deleteMany({ projectId: id });
        await project.deleteOne();
        return {
            success: true,
            message: 'Project deleted successfully',
        };
    }
    async assignInterns(projectId, internIds) {
        const project = await this.projectModel.findById(projectId);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        project.assignedTo = internIds.map(id => new mongoose_2.Types.ObjectId(id));
        await project.save();
        await this.mailService.sendProjectAssignmentEmail(String(internIds), project.title, projectId);
        return {
            success: true,
            message: 'Interns assigned successfully',
            data: project,
        };
    }
    async startProject(id) {
        const project = await this.projectModel.findById(id);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.assignedTo.length === 0) {
            throw new common_1.BadRequestException('Cannot start project without assigned interns');
        }
        project.status = shared_1.ProjectStatus.IN_PROGRESS;
        project.phase = 'execution';
        project.startDate = new Date();
        await project.save();
        return {
            success: true,
            message: 'Project started successfully',
            data: project,
        };
    }
    async completeProject(id) {
        const project = await this.projectModel.findById(id);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const incompleteTasks = await this.taskModel.countDocuments({
            projectId: id,
            status: { $ne: shared_1.TaskStatus.COMPLETED },
        });
        if (incompleteTasks > 0) {
            throw new common_1.BadRequestException('Cannot complete project with incomplete tasks');
        }
        project.status = shared_1.ProjectStatus.COMPLETED;
        project.phase = 'closure';
        project.progress = 100;
        project.completedDate = new Date();
        await project.save();
        for (const internId of project.assignedTo) {
            await this.internsService.recalculateReadiness(internId.toString());
        }
        return {
            success: true,
            message: 'Project completed successfully',
            data: project,
        };
    }
    async createTask(projectId, createTaskDto) {
        const project = await this.projectModel.findById(projectId);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const task = new this.taskModel({
            projectId,
            ...createTaskDto,
            status: shared_1.TaskStatus.TO_DO,
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
    async updateTask(taskId, updateTaskDto) {
        const task = await this.taskModel.findById(taskId);
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        Object.assign(task, updateTaskDto);
        await task.save();
        return {
            success: true,
            message: 'Task updated successfully',
            data: task,
        };
    }
    async updateTaskStatus(taskId, status) {
        const task = await this.taskModel.findById(taskId);
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        task.status = status;
        if (status === shared_1.TaskStatus.COMPLETED) {
            task.completedAt = new Date();
        }
        await task.save();
        await this.updateProjectProgress(task.projectId.toString());
        return {
            success: true,
            message: 'Task status updated successfully',
            data: task,
        };
    }
    async deleteTask(taskId) {
        const task = await this.taskModel.findById(taskId);
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        await task.deleteOne();
        return {
            success: true,
            message: 'Task deleted successfully',
        };
    }
    async uploadFiles(userId, projectId, files, taskId) {
        const project = await this.projectModel.findById(projectId);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const uploads = await Promise.all(files.map(async (file) => {
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
        }));
        return {
            success: true,
            message: 'Files uploaded successfully',
            data: uploads,
        };
    }
    async getUploads(projectId, taskId) {
        const query = { projectId };
        if (taskId)
            query.taskId = taskId;
        const uploads = await this.uploadModel
            .find(query)
            .populate('uploadedBy', 'firstName lastName email')
            .sort({ uploadDate: -1 });
        return {
            success: true,
            data: uploads,
        };
    }
    async deleteUpload(userId, uploadId) {
        const upload = await this.uploadModel.findById(uploadId);
        if (!upload) {
            throw new common_1.NotFoundException('Upload not found');
        }
        const user = await this.usersService.findById(userId);
        if (upload.uploadedBy.toString() !== userId && user.data.role !== 'admin') {
            throw new common_1.ForbiddenException('You do not have permission to delete this upload');
        }
        await upload.deleteOne();
        return {
            success: true,
            message: 'Upload deleted successfully',
        };
    }
    async getStats() {
        const [total, byStatus, byCategory, totalTasks, completedTasks, avgProgress,] = await Promise.all([
            this.projectModel.countDocuments(),
            this.projectModel.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            this.projectModel.aggregate([
                { $unwind: '$category' },
                { $group: { _id: '$category', count: { $sum: 1 } } },
            ]),
            this.taskModel.countDocuments(),
            this.taskModel.countDocuments({ status: shared_1.TaskStatus.COMPLETED }),
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
    async updateProjectProgress(projectId) {
        const tasks = await this.taskModel.find({ projectId });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === shared_1.TaskStatus.COMPLETED).length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        await this.projectModel.findByIdAndUpdate(projectId, { progress });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __param(1, (0, mongoose_1.InjectModel)(project_task_schema_1.ProjectTask.name)),
    __param(2, (0, mongoose_1.InjectModel)(project_upload_schema_1.ProjectUpload.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService,
        interns_service_1.InternsService,
        companies_service_1.CompaniesService,
        redis_service_1.RedisService,
        mail_service_1.MailService])
], ProjectsService);
