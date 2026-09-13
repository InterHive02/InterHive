"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const projects_controller_1 = require("./projects.controller");
const projects_service_1 = require("./projects.service");
const project_schema_1 = require("./schemas/project.schema");
const project_task_schema_1 = require("./schemas/project-task.schema");
const project_upload_schema_1 = require("./schemas/project-upload.schema");
const users_module_1 = require("../users/users.module");
const interns_module_1 = require("../interns/interns.module");
const companies_module_1 = require("../companies/companies.module");
const redis_module_1 = require("../../common/redis/redis.module");
const mail_module_1 = require("../../common/mail/mail.module");
let ProjectsModule = class ProjectsModule {
};
exports.ProjectsModule = ProjectsModule;
exports.ProjectsModule = ProjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: project_schema_1.Project.name, schema: project_schema_1.ProjectSchema },
                { name: project_task_schema_1.ProjectTask.name, schema: project_task_schema_1.ProjectTaskSchema },
                { name: project_upload_schema_1.ProjectUpload.name, schema: project_upload_schema_1.ProjectUploadSchema },
            ]),
            users_module_1.UsersModule,
            interns_module_1.InternsModule,
            companies_module_1.CompaniesModule,
            redis_module_1.RedisModule,
            mail_module_1.MailModule,
        ],
        controllers: [projects_controller_1.ProjectsController],
        providers: [projects_service_1.ProjectsService],
        exports: [projects_service_1.ProjectsService],
    })
], ProjectsModule);
