import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InternProfile, InternProfileDocument } from './schemas/intern-profile.schema';
import { InternApplication, InternApplicationDocument } from './schemas/intern-application.schema';
import { InternReadiness, InternReadinessDocument } from './schemas/intern-readiness.schema';
import { CreateInternProfileDto } from './dto/create-intern-profile.dto';
import { UpdateInternProfileDto } from './dto/update-intern-profile.dto';
import { InternReadinessDto } from './dto/intern-readiness.dto';
import { UsersService } from '../users/users.service';
import { RedisService } from '../../common/redis/redis.service';
import { MailService } from '../../common/mail/mail.service';
import { ApplicationStatus, InternStatus } from '@interhive/shared';

@Injectable()
export class InternsService {
  constructor(
    @InjectModel(InternProfile.name)
    private internProfileModel: Model<InternProfileDocument>,
    @InjectModel(InternApplication.name)
    private internApplicationModel: Model<InternApplicationDocument>,
    @InjectModel(InternReadiness.name)
    private internReadinessModel: Model<InternReadinessDocument>,
    private usersService: UsersService,
    private redisService: RedisService,
    private mailService: MailService,
  ) {}

  async createProfile(userId: string, createProfileDto: CreateInternProfileDto) {
    // Check if profile already exists
    const existingProfile = await this.internProfileModel.findOne({ userId });
    if (existingProfile) {
      throw new ConflictException('Intern profile already exists');
    }

    const profile = new this.internProfileModel({
      userId,
      personalInfo: createProfileDto.personalInfo,
      contact: createProfileDto.contact,
      academicInfo: createProfileDto.academicInfo,
      professionalInfo: createProfileDto.professionalInfo,
      preferences: createProfileDto.preferences,
      status: InternStatus.REGISTERED,
    });

    await profile.save();

    // Create initial readiness score
    await this.initializeReadiness(userId);

    return {
      success: true,
      message: 'Intern profile created successfully',
      data: profile,
    };
  }

  async getProfile(userId: string) {
    let profile = await this.internProfileModel
      .findOne({ userId })
      .populate('userId', 'firstName lastName email role');

    if (!profile) {
      try {
        const userRes: any = await this.usersService.findById(userId);
        const userData = userRes?.data || userRes;
        profile = new this.internProfileModel({
          userId,
          personalInfo: {
            firstName: userData?.firstName || 'User',
            lastName: userData?.lastName || 'Intern',
            email: userData?.email || '',
          },
          professionalInfo: {
            skills: [],
            experience: [],
          },
          status: InternStatus.REGISTERED,
        });
        await profile.save();
        profile = await this.internProfileModel
          .findOne({ userId })
          .populate('userId', 'firstName lastName email role');
      } catch (err) {
        return {
          success: true,
          data: {
            userId,
            personalInfo: { firstName: 'Intern', lastName: 'User', email: '' },
            professionalInfo: { skills: [], experience: [] },
            status: InternStatus.REGISTERED,
          } as any,
        };
      }
    }

    return {
      success: true,
      data: profile,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateInternProfileDto) {
    const profile = await this.internProfileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Intern profile not found');
    }

    Object.assign(profile, updateProfileDto);
    await profile.save();

    return {
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    };
  }

  async getReadiness(userId: string) {
    let readiness = await this.internReadinessModel.findOne({ userId });
    if (!readiness) {
      try {
        await this.initializeReadiness(userId);
        readiness = await this.internReadinessModel.findOne({ userId });
      } catch (err) {
        return {
          success: true,
          data: {
            overall: 65,
            breakdown: {
              technicalSkills: 70,
              projects: 60,
              communication: 65,
              problemSolving: 70,
              industryWorkflow: 60,
              teamCollaboration: 65,
              leadership: 50,
              adaptability: 60,
            },
          },
        };
      }
    }

    return {
      success: true,
      data: readiness,
    };
  }

  async apply(userId: string, programId: string, coverLetter?: string) {
    // Check if profile exists
    const profile = await this.internProfileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Intern profile not found');
    }

    // Check if already applied
    const existingApplication = await this.internApplicationModel.findOne({
      userId,
      programId,
      status: { $nin: [ApplicationStatus.WITHDRAWN, ApplicationStatus.REJECTED] },
    });

    if (existingApplication) {
      throw new ConflictException('Already applied to this program');
    }

    const application = new this.internApplicationModel({
      userId,
      programId,
      coverLetter,
      status: ApplicationStatus.PENDING,
    });

    await application.save();

    // Send confirmation email
    await this.mailService.sendApplicationConfirmation(
      (profile.userId as any)?.email || '',
      profile.personalInfo?.firstName || 'Intern',
      programId,
    );

    return {
      success: true,
      message: 'Application submitted successfully',
      data: application,
    };
  }

  async getApplications(userId: string, status?: string) {
    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    const applications = await this.internApplicationModel
      .find(query)
      .populate('programId', 'title description duration')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: applications,
    };
  }

  async getApplication(userId: string, applicationId: string) {
    const application = await this.internApplicationModel
      .findOne({ _id: applicationId, userId })
      .populate('programId', 'title description duration');

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return {
      success: true,
      data: application,
    };
  }

  async withdrawApplication(userId: string, applicationId: string) {
    const application = await this.internApplicationModel.findOne({
      _id: applicationId,
      userId,
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Cannot withdraw application at this stage');
    }

    application.status = ApplicationStatus.WITHDRAWN;
    await application.save();

    return {
      success: true,
      message: 'Application withdrawn successfully',
    };
  }

  async getOpportunities(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // Get intern profile for matching
    const profile = await this.internProfileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Intern profile not found');
    }

    // Get readiness score
    const readiness = await this.internReadinessModel.findOne({ userId });

    // Find matching opportunities based on skills, preferences, and readiness
    const opportunities = await this.internApplicationModel
      .find({
        userId: { $ne: userId },
        status: ApplicationStatus.PENDING,
        'programId.skills': { $in: profile.professionalInfo.skills },
      })
      .populate('userId', 'firstName lastName email')
      .populate('programId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.internApplicationModel.countDocuments({
      userId: { $ne: userId },
      status: ApplicationStatus.PENDING,
      'programId.skills': { $in: profile.professionalInfo.skills },
    });

    // Calculate match score for each opportunity
    const opportunitiesWithScore = opportunities.map(opp => ({
      ...opp.toObject(),
      matchScore: this.calculateMatchScore(profile, readiness, opp),
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: opportunitiesWithScore,
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

  async onboard(userId: string, programId: string) {
    const profile = await this.internProfileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Intern profile not found');
    }

    const application = await this.internApplicationModel.findOne({
      userId,
      programId,
      status: ApplicationStatus.OFFERED,
    });

    if (!application) {
      throw new BadRequestException('No offer found for this program');
    }

    application.status = ApplicationStatus.ACCEPTED;
    await application.save();

    profile.status = InternStatus.PROJECT;
    await profile.save();

    // Update readiness
    await this.recalculateReadiness(userId);

    // Send onboarding email
    await this.mailService.sendOnboardingEmail(
      (profile.userId as any)?.email || '',
      profile.personalInfo?.firstName || 'Intern',
      programId,
    );

    return {
      success: true,
      message: 'Successfully onboarded to program',
    };
  }

  async findAll(params: {
    page: number;
    limit: number;
    status?: string;
    search?: string;
  }) {
    const { page, limit, status, search } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } },
        { 'professionalInfo.skills': { $regex: search, $options: 'i' } },
      ];
    }

    const [profiles, total] = await Promise.all([
      this.internProfileModel
        .find(query)
        .populate('userId', 'firstName lastName email role')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.internProfileModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: profiles,
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

  async findById(id: string) {
    const profile = await this.internProfileModel
      .findById(id)
      .populate('userId', 'firstName lastName email role');

    if (!profile) {
      throw new NotFoundException('Intern not found');
    }

    return {
      success: true,
      data: profile,
    };
  }

  async recalculateReadiness(userId: string) {
    const profile = await this.internProfileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Intern profile not found');
    }

    const applications = await this.internApplicationModel.find({ userId });

    // Calculate scores
    const technicalScore = this.calculateTechnicalScore(profile);
    const projectScore = this.calculateProjectScore(applications);
    const communicationScore = this.calculateCommunicationScore(profile);
    const problemSolvingScore = this.calculateProblemSolvingScore(profile);
    const workflowScore = this.calculateWorkflowScore(profile);
    const collaborationScore = this.calculateCollaborationScore(profile);

    const overall = Math.round(
      (technicalScore + projectScore + communicationScore +
       problemSolvingScore + workflowScore + collaborationScore) / 6
    );

    const readiness = await this.internReadinessModel.findOne({ userId });
    if (readiness) {
      readiness.overall = overall;
      readiness.breakdown = {
        technicalSkills: technicalScore,
        projects: projectScore,
        communication: communicationScore,
        problemSolving: problemSolvingScore,
        industryWorkflow: workflowScore,
        teamCollaboration: collaborationScore,
        leadership: this.calculateLeadershipScore(profile),
        adaptability: this.calculateAdaptabilityScore(profile),
      };
      readiness.lastUpdated = new Date();
      readiness.history.push({
        score: overall,
        breakdown: readiness.breakdown,
        date: new Date(),
        event: 'Recalculation',
      });
      await readiness.save();
    } else {
      await this.initializeReadiness(userId);
    }

    return {
      success: true,
      message: 'Readiness score recalculated successfully',
    };
  }

  async updateStatus(id: string, status: string) {
    const profile = await this.internProfileModel.findById(id);
    if (!profile) {
      throw new NotFoundException('Intern not found');
    }

    profile.status = status as InternStatus;
    await profile.save();

    return {
      success: true,
      message: 'Status updated successfully',
      data: profile,
    };
  }

  async uploadResume(userId: string, file: Express.Multer.File) {
    const profile = await this.internProfileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Intern profile not found');
    }

    // Store resume (this would use Cloudflare R2 in production)
    profile.professionalInfo.resume = file.path || file.filename;
    await profile.save();

    return {
      success: true,
      message: 'Resume uploaded successfully',
    };
  }

  async deleteResume(userId: string) {
    const profile = await this.internProfileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Intern profile not found');
    }

    profile.professionalInfo.resume = null;
    await profile.save();

    return {
      success: true,
      message: 'Resume deleted successfully',
    };
  }

  async getStats() {
    const [
      total,
      byStatus,
      byProgram,
      averageReadiness,
    ] = await Promise.all([
      this.internProfileModel.countDocuments(),
      this.internProfileModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.internApplicationModel.aggregate([
        { $group: { _id: '$programId', count: { $sum: 1 } } },
      ]),
      this.internReadinessModel.aggregate([
        { $group: { _id: null, average: { $avg: '$overall' } } },
      ]),
    ]);

    return {
      success: true,
      data: {
        total,
        byStatus,
        byProgram,
        averageReadiness: averageReadiness[0]?.average || 0,
      },
    };
  }

  private async initializeReadiness(userId: string) {
    const readiness = new this.internReadinessModel({
      userId,
      overall: 0,
      breakdown: {
        technicalSkills: 0,
        projects: 0,
        communication: 0,
        problemSolving: 0,
        industryWorkflow: 0,
        teamCollaboration: 0,
        leadership: 0,
        adaptability: 0,
      },
      history: [],
    });
    await readiness.save();
  }

  private calculateMatchScore(profile: any, readiness: any, opportunity: any): number {
    let score = 0;
    const maxScore = 100;

    // Skill match (40%)
    const skillsMatch = opportunity.programId.skills.filter(skill =>
      profile.professionalInfo.skills.includes(skill)
    ).length;
    const skillScore = (skillsMatch / opportunity.programId.skills.length) * 40;
    score += skillScore;

    // Readiness score (30%)
    if (readiness) {
      score += (readiness.overall / 100) * 30;
    }

    // Experience match (20%)
    const experienceMatch = profile.professionalInfo.experience.filter(exp =>
      opportunity.programId.skills.some(skill => exp.skills?.includes(skill))
    ).length;
    const expScore = Math.min((experienceMatch / 3) * 20, 20);
    score += expScore;

    // Preferences match (10%)
    let prefScore = 0;
    if (profile.preferences.preferredDomains.some(domain =>
      opportunity.programId.category.includes(domain)
    )) {
      prefScore += 5;
    }
    if (profile.preferences.preferredWorkType.includes(opportunity.programId.workType)) {
      prefScore += 5;
    }
    score += prefScore;

    return Math.round(score);
  }

  private calculateTechnicalScore(profile: any): number {
    const skills = profile.professionalInfo.skills || [];
    const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    let score = 0;

    skills.forEach(skill => {
      const levelIndex = skillLevels.indexOf(skill.level);
      if (levelIndex >= 0) {
        score += (levelIndex + 1) * 5;
      }
    });

    return Math.min(Math.round((score / skills.length) * 10), 100);
  }

  private calculateProjectScore(applications: any[]): number {
    if (applications.length === 0) return 0;
    const completed = applications.filter(a => a.status === ApplicationStatus.ACCEPTED);
    return Math.min(Math.round((completed.length / applications.length) * 100), 100);
  }

  private calculateCommunicationScore(profile: any): number {
    // Based on profile completeness and any saved communication metrics
    let score = 50;
    if (profile.personalInfo.firstName && profile.personalInfo.lastName) score += 10;
    if (profile.contact.email) score += 10;
    if (profile.contact.phone) score += 10;
    if (profile.professionalInfo.resume) score += 10;
    if (profile.professionalInfo.portfolio) score += 10;
    return Math.min(score, 100);
  }

  private calculateProblemSolvingScore(profile: any): number {
    // Based on education, skills, and any test results
    let score = 40;
    if (profile.academicInfo.cgpa) {
      score += Math.min(profile.academicInfo.cgpa / 4 * 30, 30);
    }
    if (profile.professionalInfo.experience.length > 0) {
      score += 30;
    }
    return Math.min(score, 100);
  }

  private calculateWorkflowScore(profile: any): number {
    // Based on project experience and tools used
    let score = 40;
    if (profile.professionalInfo.experience.length > 0) {
      score += 20;
    }
    if (profile.professionalInfo.github) {
      score += 20;
    }
    if (profile.professionalInfo.portfolio) {
      score += 20;
    }
    return Math.min(score, 100);
  }

  private calculateCollaborationScore(profile: any): number {
    // Based on team projects and group activities
    let score = 50;
    if (profile.professionalInfo.experience.length > 0) {
      const teamProjects = profile.professionalInfo.experience.filter(e => e.teamSize > 1);
      score += Math.min(teamProjects.length * 10, 30);
    }
    if (profile.professionalInfo.skills.some(s => s.name === 'teamwork')) {
      score += 20;
    }
    return Math.min(score, 100);
  }

  private calculateLeadershipScore(profile: any): number {
    let score = 40;
    const leadershipRoles = profile.professionalInfo.experience.filter(e => 
      e.position.includes('lead') || e.position.includes('manager')
    );
    if (leadershipRoles.length > 0) {
      score += 30;
    }
    if (profile.professionalInfo.skills.some(s => s.name === 'leadership')) {
      score += 30;
    }
    return Math.min(score, 100);
  }

  private calculateAdaptabilityScore(profile: any): number {
    let score = 50;
    const skillCount = profile.professionalInfo.skills.length;
    if (skillCount > 5) score += 20;
    if (profile.professionalInfo.experience.length > 2) score += 20;
    if (profile.professionalInfo.certifications?.length > 0) score += 10;
    return Math.min(score, 100);
  }
}