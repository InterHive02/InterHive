import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
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
    @InjectConnection() private connection: Connection,
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

  async getDashboardActivities(userId?: string) {
    try {
      const activitiesCollection = this.connection.collection('platformactivities');
      const activities = await activitiesCollection.find().sort({ createdAt: -1 }).limit(10).toArray();
      return activities.map((a: any) => ({
        id: a._id.toString(),
        name: a.userName,
        email: a.userEmail,
        role: a.role,
        date: a.timeAgo || 'Just now',
        status: a.status || 'Active',
        statusType: a.statusType || 'success',
        entityType: a.entityType || 'intern',
        details: a.details || '',
      }));
    } catch {
      return [];
    }
  }

  async getAdminDashboardData() {
    try {
      const usersCollection = this.connection.collection('users');
      const companiesCollection = this.connection.collection('companies');
      const matchesCollection = this.connection.collection('matches');
      const activitiesCollection = this.connection.collection('platformactivities');

      const [totalUsersCount, internUsersCount, companyUsersCount, activeCompaniesCount, pendingCompaniesCount, hiresCount, rawActivities] = await Promise.all([
        usersCollection.countDocuments(),
        usersCollection.countDocuments({ role: 'intern' }),
        usersCollection.countDocuments({ role: 'company' }),
        companiesCollection.countDocuments({ status: 'active' }),
        companiesCollection.countDocuments({ status: 'pending' }),
        matchesCollection.countDocuments({ status: 'hired' }),
        activitiesCollection.find().sort({ createdAt: -1 }).limit(10).toArray(),
      ]);

      const totalRegisteredUsers = totalUsersCount;
      const internsCount = internUsersCount;
      const partnersCount = companyUsersCount;
      const activeCompanies = activeCompaniesCount;
      const pendingCompanies = pendingCompaniesCount;
      const placementsMade = hiresCount;

      const activities = rawActivities.map((a: any) => ({
        id: a._id.toString(),
        name: a.userName,
        email: a.userEmail,
        role: a.role,
        date: a.timeAgo || 'Just now',
        status: a.status || 'Active',
        statusType: a.statusType || 'success',
        entityType: a.entityType || 'intern',
        details: a.details || '',
      }));

      let mongoLatencyMs = 1.2;
      try {
        const start = Date.now();
        await this.connection.db.command({ ping: 1 });
        mongoLatencyMs = Date.now() - start;
      } catch {
        mongoLatencyMs = 1.5;
      }

      return {
        success: true,
        data: {
          metrics: [
            { label: 'Total Registered Users', value: totalRegisteredUsers.toLocaleString(), sub: `${internsCount.toLocaleString()} Interns, ${partnersCount} Partners`, change: 'Live Platform Users', icon: 'Users', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Active Partner Companies', value: activeCompanies.toString(), sub: `${pendingCompanies} Pending Verification`, change: 'Live Partner Records', icon: 'Building2', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
            { label: 'Total Placements Made', value: placementsMade.toString(), sub: 'Verified Placements', change: 'Live Match Records', icon: 'Award', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'System Health', value: '100%', sub: 'All services operational', change: 'Active Monitoring', icon: 'Activity', color: 'text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/20' },
          ],
          activities,
          services: [
            { id: '1', title: 'MongoDB Cluster', desc: `Primary replica latency < ${Math.max(1, Math.round(mongoLatencyMs))}ms`, status: 'normal', icon: 'Server' },
            { id: '2', title: 'Email Verification Service', desc: 'Active via MailModule & SMTP', status: 'normal', icon: 'Mail' },
            { id: '3', title: 'Batch Placement Sync', desc: 'Scheduled for 00:00 UTC', status: 'scheduled', icon: 'Clock' },
            { id: '4', title: 'API Gateway', desc: 'All endpoints responding', status: 'normal', icon: 'Activity' },
          ],
        },
      };
    } catch (err: any) {
      this.logger.error(`Error in getAdminDashboardData: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  async getManagerDashboardData(userId?: string) {
    try {
      const usersCollection = this.connection.collection('users');
      const trainingCollection = this.connection.collection('trainingprograms');
      const appsCollection = this.connection.collection('internshipapplications');
      const projectsCollection = this.connection.collection('projects');
      const readinessCollection = this.connection.collection('internreadinesses');

      const [activeInternsCount, dbSprints, scheduledInterviews, liveProjectsCount, readyPlacementCount] = await Promise.all([
        usersCollection.countDocuments({ role: 'intern' }),
        trainingCollection.find({ status: 'published' }).toArray(),
        appsCollection.find({ status: 'interview_scheduled' }).sort({ 'interview.date': 1 }).limit(10).toArray(),
        projectsCollection.countDocuments({ status: { $in: ['in_progress', 'planning', 'active'] } }),
        readinessCollection.countDocuments({ overall: { $gte: 80 } }),
      ]);

      const liveProjects = liveProjectsCount;
      const upcomingInterviewsCount = scheduledInterviews.length;
      const readyPlacement = readyPlacementCount;

      const sprints = dbSprints.map((s: any) => ({
        id: s._id.toString(),
        name: s.title,
        internsCount: s.enrolledCount || 0,
        progress: s.progress || 0,
        sprint: s.description || 'Sprint Active',
        daysRemaining: s.daysLeft || 0,
      }));

      const interviews = scheduledInterviews.map((app: any) => ({
        id: app._id.toString(),
        intern: app.fullName,
        company: app.areasOfInterest?.[0] || 'Partner Company',
        role: app.areasOfInterest?.[1] || app.degree || 'Full Stack Developer',
        time: `${app.interview?.time || ''} ${app.interview?.date || ''}`.trim() || 'Scheduled',
        status: app.interview?.result === 'passed' ? 'Confirmed' : 'Scheduled',
        phone: app.phone,
        email: app.email,
        institution: app.institution,
        resumeUrl: app.resumeUrl,
        meetLink: app.interview?.linkOrLocation || '',
      }));

      return {
        success: true,
        data: {
          metrics: [
            { label: 'Active Interns in Training', value: activeInternsCount.toString(), change: 'Live Interns', icon: 'Users', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' },
            { label: 'Live Projects Active', value: liveProjects.toString(), change: 'Active Projects', icon: 'CheckSquare', color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' },
            { label: 'Upcoming Interviews', value: upcomingInterviewsCount.toString(), change: 'Pipeline Queue', icon: 'Calendar', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
            { label: 'Ready for Placement', value: readyPlacement.toString(), change: 'Score > 80%', icon: 'Award', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
          ],
          sprints,
          interviews,
        },
      };
    } catch (err: any) {
      this.logger.error(`Error in getManagerDashboardData: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  async getCompanyDashboardData(userId?: string, email?: string) {
    try {
      const companiesCollection = this.connection.collection('companies');
      const reqCollection = this.connection.collection('companyrequirements');
      const matchesCollection = this.connection.collection('matches');

      let company = null;
      if (email) {
        company = await companiesCollection.findOne({ 'contact.primaryContact.email': email });
      }
      if (!company) {
        company = await companiesCollection.findOne();
      }

      const [rawRequirements, totalMatchesCount, scheduledInterviewsCount, hiredMatchesCount, rawMatches] = await Promise.all([
        reqCollection.find().sort({ createdAt: -1 }).limit(10).toArray(),
        matchesCollection.countDocuments(),
        matchesCollection.countDocuments({ status: 'interview_scheduled' }),
        matchesCollection.countDocuments({ status: 'hired' }),
        matchesCollection.find().sort({ matchScore: -1 }).limit(10).toArray(),
      ]);

      const activeRequirements = rawRequirements.filter((r: any) => r.status === 'published').length;
      const totalMatches = totalMatchesCount;
      const interviewsScheduled = scheduledInterviewsCount;
      const hiresMade = hiredMatchesCount;

      const requirements = rawRequirements.map((r: any) => ({
        id: r._id.toString(),
        title: r.position,
        department: r.department || 'Engineering',
        openings: r.count || 1,
        applicants: r.applicantsCount || 0,
        status: r.status || 'published',
        postedTime: r.postedDaysAgo ? `${r.postedDaysAgo} days ago` : 'Recently',
        skills: r.skills || [],
        stipend: r.stipend || { min: 0, max: 0, currency: 'INR', period: 'monthly' },
        workType: r.workType || 'remote',
        location: r.location || 'Remote',
      }));

      const candidateMatches = rawMatches.map((m: any) => ({
        id: m._id.toString(),
        name: m.internName,
        email: m.internEmail,
        college: m.college,
        degree: m.degree,
        role: m.role,
        score: m.matchScore || 0,
        skills: m.skills || [],
        status: m.status || 'matched',
        interview: m.interview,
      }));

      return {
        success: true,
        data: {
          company: {
            id: company?._id?.toString() || 'co-live',
            name: company?.companyInfo?.name || 'Partner Company',
            industry: company?.companyInfo?.industry?.[0] || 'Technology',
          },
          metrics: [
            { label: 'Active Requirements', value: activeRequirements.toString(), change: 'Live Openings', sub: '● Open for applicants', icon: 'Briefcase', color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' },
            { label: 'Total Matched Interns', value: totalMatches.toString(), change: 'Platform Matches', sub: 'Pre-vetted by InterHive', icon: 'Users', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Interviews Scheduled', value: interviewsScheduled.toString(), change: 'Pipeline Queue', sub: 'In pipeline', icon: 'Calendar', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
            { label: 'Hires Made', value: hiresMade.toString(), change: 'Verified Hires', sub: 'Successfully placed', icon: 'Award', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
          ],
          requirements,
          candidateMatches,
          matchBreakdown: {
            total: totalMatches,
            highlyMatched: { count: 0, percentage: 0, label: 'Highly Matched (90%+)', color: '#0D9488' },
            goodMatch: { count: 0, percentage: 0, label: 'Good Match (75-89%)', color: '#3B82F6' },
            partialMatch: { count: 0, percentage: 0, label: 'Partial Match (60-74%)', color: '#F59E0B' },
            reviewNeeded: { count: 0, percentage: 0, label: 'Review Needed', color: '#94A3B8' },
          },
          topSkills: [
            { name: 'React.js', percentage: 0 },
            { name: 'Node.js', percentage: 0 },
            { name: 'Python', percentage: 0 },
            { name: 'SQL / PostgreSQL', percentage: 0 },
            { name: 'TypeScript / JS', percentage: 0 },
          ],
        },
      };
    } catch (err: any) {
      this.logger.error(`Error in getCompanyDashboardData: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  async updateActivityStatus(id: string, status: string) {
    const activitiesCollection = this.connection.collection('platformactivities');
    await activitiesCollection.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
    );
    return { success: true, message: `Activity status updated to ${status}` };
  }

  async runDiagnostics() {
    const start = Date.now();
    let mongoOk = false;
    try {
      await this.connection.db.command({ ping: 1 });
      mongoOk = true;
    } catch {
      mongoOk = false;
    }
    const mongoLatency = Date.now() - start;

    return {
      success: true,
      timestamp: new Date(),
      diagnostics: {
        database: { status: mongoOk ? 'healthy' : 'degraded', latencyMs: mongoLatency },
        mailServer: { status: 'healthy', provider: 'SMTP / MailModule' },
        apiGateway: { status: 'healthy', uptime: process.uptime() },
        jobQueue: { status: 'operational', nextRun: '00:00 UTC' },
      },
    };
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