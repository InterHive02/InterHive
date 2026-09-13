import { Injectable, Logger } from '@nestjs/common';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { ReadinessAnalyticsService } from './services/readiness-analytics.service';
import { CompanyAnalyticsService } from './services/company-analytics.service';
import { RedisService } from '../../common/redis/redis.service';
import { UsersService } from '../users/users.service';
import { InternsService } from '../interns/interns.service';
import { CompaniesService } from '../companies/companies.service';
import { ProjectsService } from '../projects/projects.service';
import { MatchingService } from '../matching/matching.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readinessAnalytics: ReadinessAnalyticsService,
    private companyAnalytics: CompanyAnalyticsService,
    private redisService: RedisService,
    private usersService: UsersService,
    private internsService: InternsService,
    private companiesService: CompaniesService,
    private projectsService: ProjectsService,
    private matchingService: MatchingService,
  ) {}

  async getDashboardAnalytics(user: User, query: AnalyticsQueryDto) {
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

  async getReadinessAnalytics(query: AnalyticsQueryDto) {
    const cacheKey = `analytics:readiness:${JSON.stringify(query)}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const data = await this.readinessAnalytics.getReadinessAnalytics(query);
    await this.redisService.set(cacheKey, JSON.stringify(data), 300);
    return data;
  }

  async getInternReadinessAnalytics(internId: string) {
    const cacheKey = `analytics:intern:readiness:${internId}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const data = await this.readinessAnalytics.getInternReadiness(internId);
    await this.redisService.set(cacheKey, JSON.stringify(data), 60);
    return data;
  }

  async getCompanyAnalytics(query: AnalyticsQueryDto) {
    const cacheKey = `analytics:company:${JSON.stringify(query)}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const data = await this.companyAnalytics.getCompanyAnalytics(query);
    await this.redisService.set(cacheKey, JSON.stringify(data), 300);
    return data;
  }

  async getCompanyAnalyticsById(companyId: string) {
    const cacheKey = `analytics:company:id:${companyId}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const data = await this.companyAnalytics.getCompanyAnalyticsById(companyId);
    await this.redisService.set(cacheKey, JSON.stringify(data), 300);
    return data;
  }

  async getProjectAnalytics(query: AnalyticsQueryDto) {
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
      byStatus: projectData.reduce((acc: any, p: any) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {}),
      averageProgress: projectData.length > 0 
        ? Math.round(projectData.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / projectData.length) 
        : 0,
      totalTasks: 0,
      completedTasks: 0,
      tasksCompletionRate: 0,
    };

    for (const project of projectData) {
      if (project.tasks && Array.isArray(project.tasks)) {
        data.totalTasks += project.tasks.length;
        const completed = project.tasks.filter((t: any) => t?.status === 'completed');
        data.completedTasks += completed.length;
      }
    }

    if (data.totalTasks > 0) {
      data.tasksCompletionRate = Math.round((data.completedTasks / data.totalTasks) * 100);
    }

    await this.redisService.set(cacheKey, JSON.stringify(data), 300);
    return data;
  }

  async getMatchingAnalytics(query: AnalyticsQueryDto) {
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
      byStatus: matchesData.reduce((acc: any, m: any) => {
        acc[m.status] = (acc[m.status] || 0) + 1;
        return acc;
      }, {}),
      averageMatchScore: matchesData.length > 0 
        ? Math.round(matchesData.reduce((sum: number, m: any) => sum + (m.matchScore || 0), 0) / matchesData.length) 
        : 0,
      successfulHires: matchesData.filter((m: any) => m.status === 'hired').length || 0,
      hiringRate: matchTotal > 0 
        ? Math.round((matchesData.filter((m: any) => m.status === 'hired').length / matchTotal) * 100) 
        : 0,
    };

    await this.redisService.set(cacheKey, JSON.stringify(data), 300);
    return data;
  }

  async getTrendAnalytics(query: AnalyticsQueryDto) {
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

  // SIMPLIFIED: Returns empty activities array (no errors)
  async getDashboardActivities(userId: string) {
    // Return empty array - this will be implemented later
    return [];
  }

  private async getAdminDashboard(query: AnalyticsQueryDto) {
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

  private async getHRDashboard(query: AnalyticsQueryDto) {
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

  private async getManagerDashboard(userId: string, query: AnalyticsQueryDto) {
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

  private async getInternDashboard(userId: string, query: AnalyticsQueryDto) {
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
        pending: applications.filter((a: any) => a.status === 'pending').length,
        offered: applications.filter((a: any) => a.status === 'offered').length,
        total: applications.length,
      },
      nextMilestones: [],
    };
  }

  private async getCompanyDashboard(userId: string, query: AnalyticsQueryDto) {
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
        activeRequirements: requirements.filter((r: any) => r.status === 'published').length,
        totalMatches: matchTotal,
        hiredInterns: matches.filter((m: any) => m.status === 'hired').length || 0,
      },
      requirements: requirements,
      recentMatches: matches.slice(0, 5) || [],
    };
  }
}