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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const readiness_analytics_service_1 = require("./services/readiness-analytics.service");
const company_analytics_service_1 = require("./services/company-analytics.service");
const redis_service_1 = require("../../common/redis/redis.service");
const users_service_1 = require("../users/users.service");
const interns_service_1 = require("../interns/interns.service");
const companies_service_1 = require("../companies/companies.service");
const projects_service_1 = require("../projects/projects.service");
const matching_service_1 = require("../matching/matching.service");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(readinessAnalytics, companyAnalytics, redisService, usersService, internsService, companiesService, projectsService, matchingService) {
        this.readinessAnalytics = readinessAnalytics;
        this.companyAnalytics = companyAnalytics;
        this.redisService = redisService;
        this.usersService = usersService;
        this.internsService = internsService;
        this.companiesService = companiesService;
        this.projectsService = projectsService;
        this.matchingService = matchingService;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async getDashboardAnalytics(user, query) {
        const cacheKey = `analytics:dashboard:${user.id}:${JSON.stringify(query)}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const userRole = user.role;
        let data;
        switch (userRole) {
            case 'admin':
                data = await this.getAdminDashboard(query);
                break;
            case 'hr':
                data = await this.getHRDashboard(query);
                break;
            case 'manager':
                data = await this.getManagerDashboard(user.id, query);
                break;
            case 'intern':
                data = await this.getInternDashboard(user.id, query);
                break;
            case 'company':
                data = await this.getCompanyDashboard(user.id, query);
                break;
            default:
                data = { message: 'Invalid user role' };
        }
        await this.redisService.set(cacheKey, JSON.stringify(data), 300);
        return data;
    }
    async getReadinessAnalytics(query) {
        const cacheKey = `analytics:readiness:${JSON.stringify(query)}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const data = await this.readinessAnalytics.getReadinessAnalytics(query);
        await this.redisService.set(cacheKey, JSON.stringify(data), 300);
        return data;
    }
    async getInternReadinessAnalytics(internId) {
        const cacheKey = `analytics:intern:readiness:${internId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const data = await this.readinessAnalytics.getInternReadiness(internId);
        await this.redisService.set(cacheKey, JSON.stringify(data), 60);
        return data;
    }
    async getCompanyAnalytics(query) {
        const cacheKey = `analytics:company:${JSON.stringify(query)}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const data = await this.companyAnalytics.getCompanyAnalytics(query);
        await this.redisService.set(cacheKey, JSON.stringify(data), 300);
        return data;
    }
    async getCompanyAnalyticsById(companyId) {
        const cacheKey = `analytics:company:id:${companyId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const data = await this.companyAnalytics.getCompanyAnalyticsById(companyId);
        await this.redisService.set(cacheKey, JSON.stringify(data), 300);
        return data;
    }
    async getProjectAnalytics(query) {
        const cacheKey = `analytics:project:${JSON.stringify(query)}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const projectsResult = await this.projectsService.findAll({
            page: 1,
            limit: 1000,
            status: query.status,
        });
        const projectData = projectsResult?.data || [];
        const projectTotal = projectsResult?.meta?.total || projectData.length || 0;
        const data = {
            totalProjects: projectTotal,
            byStatus: projectData.reduce((acc, p) => {
                acc[p.status] = (acc[p.status] || 0) + 1;
                return acc;
            }, {}),
            averageProgress: projectData.length > 0
                ? Math.round(projectData.reduce((sum, p) => sum + (p.progress || 0), 0) / projectData.length)
                : 0,
            totalTasks: 0,
            completedTasks: 0,
            tasksCompletionRate: 0,
        };
        for (const project of projectData) {
            if (project.tasks && Array.isArray(project.tasks)) {
                data.totalTasks += project.tasks.length;
                const completed = project.tasks.filter((t) => t?.status === 'completed');
                data.completedTasks += completed.length;
            }
        }
        if (data.totalTasks > 0) {
            data.tasksCompletionRate = Math.round((data.completedTasks / data.totalTasks) * 100);
        }
        await this.redisService.set(cacheKey, JSON.stringify(data), 300);
        return data;
    }
    async getMatchingAnalytics(query) {
        const cacheKey = `analytics:matching:${JSON.stringify(query)}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const matchesResult = await this.matchingService.getMyMatches('all', undefined, 1, 1000);
        const matchesData = matchesResult?.data || [];
        const matchTotal = matchesResult?.meta?.total || matchesData.length || 0;
        const data = {
            totalMatches: matchTotal,
            byStatus: matchesData.reduce((acc, m) => {
                acc[m.status] = (acc[m.status] || 0) + 1;
                return acc;
            }, {}),
            averageMatchScore: matchesData.length > 0
                ? Math.round(matchesData.reduce((sum, m) => sum + (m.matchScore || 0), 0) / matchesData.length)
                : 0,
            successfulHires: matchesData.filter((m) => m.status === 'hired').length || 0,
            hiringRate: matchTotal > 0
                ? Math.round((matchesData.filter((m) => m.status === 'hired').length / matchTotal) * 100)
                : 0,
        };
        await this.redisService.set(cacheKey, JSON.stringify(data), 300);
        return data;
    }
    async getTrendAnalytics(query) {
        const cacheKey = `analytics:trend:${JSON.stringify(query)}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const month = query.month || new Date().getMonth() + 1;
        const year = query.year || new Date().getFullYear();
        const trends = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date(year, month - 1 - i, 1);
            trends.unshift({
                month: date.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear(),
                internsRegistered: 0,
                assessmentsCompleted: 0,
                projectsCompleted: 0,
                matchesMade: 0,
                hiresMade: 0,
            });
        }
        await this.redisService.set(cacheKey, JSON.stringify(trends), 300);
        return trends;
    }
    async exportReadinessData() {
        return await this.readinessAnalytics.exportReadinessData();
    }
    async exportCompanyData() {
        return await this.companyAnalytics.exportCompanyData();
    }
    async refreshCache() {
        await this.redisService.flushAll();
        return { success: true, message: 'Cache cleared successfully' };
    }
    async getDashboardActivities(userId) {
        return [];
    }
    async getAdminDashboard(query) {
        const [readiness, companies, projects, matching] = await Promise.all([
            this.getReadinessAnalytics(query),
            this.getCompanyAnalytics(query),
            this.getProjectAnalytics(query),
            this.getMatchingAnalytics(query),
        ]);
        const internStats = await this.internsService.getStats();
        const companyStats = await this.companiesService.getStats();
        const projectStats = await this.projectsService.getStats();
        return {
            overview: {
                totalInterns: internStats?.data?.total || 0,
                totalCompanies: companyStats?.data?.total || 0,
                activeProjects: projectStats?.data?.total || 0,
                totalMatches: matching.totalMatches || 0,
                hiredInterns: matching.successfulHires || 0,
            },
            readiness,
            companies,
            projects,
            matching,
        };
    }
    async getHRDashboard(query) {
        const [readiness, matching] = await Promise.all([
            this.getReadinessAnalytics(query),
            this.getMatchingAnalytics(query),
        ]);
        const internStats = await this.internsService.getStats();
        return {
            overview: {
                totalInterns: internStats?.data?.total || 0,
                pendingAssessments: 0,
                pendingInterviews: 0,
                activeMatching: matching.totalMatches || 0,
            },
            readiness,
            matching,
        };
    }
    async getManagerDashboard(userId, query) {
        const projectsResult = await this.projectsService.getMyProjects(userId);
        const projects = projectsResult?.data || [];
        const teamInternsResult = await this.internsService.findAll({
            page: 1,
            limit: 100,
            status: 'project',
        });
        const teamInterns = teamInternsResult?.data || [];
        const teamSize = teamInternsResult?.meta?.total || teamInterns.length || 0;
        return {
            overview: {
                teamSize: teamSize,
                activeProjects: projects.filter(p => p.status === 'in_progress').length,
                completedProjects: projects.filter(p => p.status === 'completed').length,
                teamReadiness: 0,
            },
            projects: projects,
            teamMembers: teamInterns,
        };
    }
    async getInternDashboard(userId, query) {
        const readiness = await this.getInternReadinessAnalytics(userId);
        const projectsResult = await this.projectsService.getMyProjects(userId);
        const projects = projectsResult?.data || [];
        const applicationsResult = await this.internsService.getApplications(userId);
        const applications = applicationsResult?.data || [];
        return {
            readiness,
            projects: {
                active: projects.filter(p => p.status === 'in_progress').length,
                completed: projects.filter(p => p.status === 'completed').length,
                total: projects.length,
            },
            applications: {
                pending: applications.filter((a) => a.status === 'pending').length,
                offered: applications.filter((a) => a.status === 'offered').length,
                total: applications.length,
            },
            nextMilestones: [],
        };
    }
    async getCompanyDashboard(userId, query) {
        const companyResult = await this.companiesService.findById(userId);
        const company = companyResult?.data || {};
        const requirementsResult = await this.companiesService.getRequirements(userId);
        const requirements = requirementsResult?.data || [];
        const matchesResult = await this.matchingService.getMyMatches(userId);
        const matches = matchesResult?.data || [];
        const matchTotal = matchesResult?.meta?.total || matches.length || 0;
        return {
            overview: {
                totalRequirements: requirements.length,
                activeRequirements: requirements.filter((r) => r.status === 'published').length,
                totalMatches: matchTotal,
                hiredInterns: matches.filter((m) => m.status === 'hired').length || 0,
            },
            requirements: requirements,
            recentMatches: matches.slice(0, 5) || [],
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [readiness_analytics_service_1.ReadinessAnalyticsService,
        company_analytics_service_1.CompanyAnalyticsService,
        redis_service_1.RedisService,
        users_service_1.UsersService,
        interns_service_1.InternsService,
        companies_service_1.CompaniesService,
        projects_service_1.ProjectsService,
        matching_service_1.MatchingService])
], AnalyticsService);
