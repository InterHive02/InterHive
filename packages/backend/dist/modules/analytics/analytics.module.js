"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const analytics_controller_1 = require("./analytics.controller");
const analytics_service_1 = require("./analytics.service");
const readiness_analytics_service_1 = require("./services/readiness-analytics.service");
const company_analytics_service_1 = require("./services/company-analytics.service");
const users_module_1 = require("../users/users.module");
const interns_module_1 = require("../interns/interns.module");
const companies_module_1 = require("../companies/companies.module");
const assessments_module_1 = require("../assessments/assessments.module");
const projects_module_1 = require("../projects/projects.module");
const matching_module_1 = require("../matching/matching.module");
const redis_module_1 = require("../../common/redis/redis.module");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            interns_module_1.InternsModule,
            companies_module_1.CompaniesModule,
            assessments_module_1.AssessmentsModule,
            projects_module_1.ProjectsModule,
            matching_module_1.MatchingModule,
            redis_module_1.RedisModule,
        ],
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [analytics_service_1.AnalyticsService, readiness_analytics_service_1.ReadinessAnalyticsService, company_analytics_service_1.CompanyAnalyticsService],
        exports: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);
