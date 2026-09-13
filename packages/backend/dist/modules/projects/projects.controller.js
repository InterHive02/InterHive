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
exports.ProjectsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const projects_service_1 = require("./projects.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const shared_1 = require("@interhive/shared");
const user_schema_1 = require("../users/schemas/user.schema");
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    async create(createProjectDto) {
        return this.projectsService.create(createProjectDto);
    }
    async findAll(page = 1, limit = 10, status, companyId, assignedTo, search) {
        return this.projectsService.findAll({ page, limit, status, companyId, assignedTo, search });
    }
    async getMyProjects(user, status) {
        if (!user) {
            return { success: true, data: [] };
        }
        const userId = user?._id?.toString() || user?.id || '';
        if (!userId) {
            return { success: true, data: [] };
        }
        return this.projectsService.getMyProjects(userId, status);
    }
    async getStats() {
        return this.projectsService.getStats();
    }
    async findById(id) {
        return this.projectsService.findById(id);
    }
    async update(id, updateProjectDto) {
        return this.projectsService.update(id, updateProjectDto);
    }
    async delete(id) {
        await this.projectsService.delete(id);
    }
    async assignInterns(id, internIds) {
        return this.projectsService.assignInterns(id, internIds);
    }
    async startProject(id) {
        return this.projectsService.startProject(id);
    }
    async completeProject(id) {
        return this.projectsService.completeProject(id);
    }
    async createTask(projectId, createTaskDto) {
        return this.projectsService.createTask(projectId, createTaskDto);
    }
    async updateTask(taskId, updateTaskDto) {
        return this.projectsService.updateTask(taskId, updateTaskDto);
    }
    async updateTaskStatus(taskId, status) {
        return this.projectsService.updateTaskStatus(taskId, status);
    }
    async deleteTask(taskId) {
        await this.projectsService.deleteTask(taskId);
    }
    async uploadFiles(user, projectId, files, taskId) {
        return this.projectsService.uploadFiles(user.id, projectId, files, taskId);
    }
    async getUploads(projectId, taskId) {
        return this.projectsService.getUploads(projectId, taskId);
    }
    async deleteUpload(user, uploadId) {
        return this.projectsService.deleteUpload(user.id, uploadId);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new project' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Project created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all projects' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Projects retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('companyId')),
    __param(4, (0, common_1.Query)('assignedTo')),
    __param(5, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my projects' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Projects retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getMyProjects", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get project statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get project by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete project' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Project deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Assign interns to project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Interns assigned successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('internIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "assignInterns", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project started successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "startProject", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Complete project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project completed successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "completeProject", null);
__decorate([
    (0, common_1.Post)(':projectId/tasks'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Create task for project' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task created successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "createTask", null);
__decorate([
    (0, common_1.Put)('tasks/:taskId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task updated successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Post)('tasks/:taskId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task status updated successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "updateTaskStatus", null);
__decorate([
    (0, common_1.Delete)('tasks/:taskId'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete task' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Task deleted successfully' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "deleteTask", null);
__decorate([
    (0, common_1.Post)(':projectId/uploads'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload project files' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Files uploaded successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Body)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, Array, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Get)(':projectId/uploads'),
    (0, swagger_1.ApiOperation)({ summary: 'Get project uploads' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Uploads retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Query)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getUploads", null);
__decorate([
    (0, common_1.Delete)('uploads/:uploadId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete upload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upload deleted successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('uploadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "deleteUpload", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)('Projects'),
    (0, common_1.Controller)('projects'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
