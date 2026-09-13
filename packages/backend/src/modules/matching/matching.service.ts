import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match, MatchDocument } from './schemas/match.schema';
import { MatchRequestDto } from './dto/match-request.dto';
import { SkillMatcher } from './algorithms/skill-matcher';
import { ReadinessScorer } from './algorithms/readiness-scorer';
import { UsersService } from '../users/users.service';
import { InternsService } from '../interns/interns.service';
import { CompaniesService } from '../companies/companies.service';
import { AssessmentsService } from '../assessments/assessments.service';
import { RedisService } from '../../common/redis/redis.service';
import { MailService } from '../../common/mail/mail.service';
import { MatchStatus } from '@interhive/shared';

@Injectable()
export class MatchingService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    private skillMatcher: SkillMatcher,
    private readinessScorer: ReadinessScorer,
    private usersService: UsersService,
    private internsService: InternsService,
    private companiesService: CompaniesService,
    private assessmentsService: AssessmentsService,
    private redisService: RedisService,
    private mailService: MailService,
  ) {}

  async findMatches(userId: string, matchRequestDto: MatchRequestDto) {
    const user = await this.usersService.findById(userId);
    const userRole = user.data.role;

    let matches = [];

    if (userRole === 'intern') {
      matches = await this.findInternMatches(userId, matchRequestDto);
    } else if (userRole === 'company' || userRole === 'hr') {
      matches = await this.findCompanyMatches(userId, matchRequestDto);
    } else {
      throw new BadRequestException('Invalid user role for matching');
    }

    // Store matches in database
    const savedMatches = await this.saveMatches(matches, userId);

    return {
      success: true,
      message: 'Matches found successfully',
      data: savedMatches,
    };
  }

  async getMyMatches(userId: string, status?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const query: any = {
      $or: [
        { internId: userId },
        { companyId: userId },
      ],
    };

    if (status) query.status = status;

    const [matches, total] = await Promise.all([
      this.matchModel
        .find(query)
        .populate('internId', 'firstName lastName email employeeId profilePhoto')
        .populate('companyId', 'companyInfo.name companyInfo.logo')
        .populate('requirementId', 'position department skills')
        .sort({ matchScore: -1 })
        .skip(skip)
        .limit(limit),
      this.matchModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: matches,
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

  async getMatch(id: string) {
    const match = await this.matchModel
      .findById(id)
      .populate('internId', 'firstName lastName email employeeId profilePhoto')
      .populate('companyId', 'companyInfo.name companyInfo.logo companyInfo.description')
      .populate('requirementId', 'position department skills stipend');

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return {
      success: true,
      data: match,
    };
  }

  async acceptMatch(userId: string, matchId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Check if user is authorized
    if (match.internId.toString() !== userId && match.companyId.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to accept this match');
    }

    if (match.status !== 'pending') {
      throw new BadRequestException('Match is not in pending status');
    }

    match.status = 'accepted';
    match.acceptedAt = new Date();
    await match.save();

    // Send notification
    await this.mailService.sendMatchAcceptedEmail(
      match.internId.toString(),
      match.companyId.toString(),
      matchId,
    );

    return {
      success: true,
      message: 'Match accepted successfully',
      data: match,
    };
  }

  async rejectMatch(userId: string, matchId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Check if user is authorized
    if (match.internId.toString() !== userId && match.companyId.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to reject this match');
    }

    if (match.status !== 'pending') {
      throw new BadRequestException('Match is not in pending status');
    }

    match.status = 'rejected';
    match.rejectedAt = new Date();
    await match.save();

    return {
      success: true,
      message: 'Match rejected successfully',
      data: match,
    };
  }

  async scheduleInterview(
    userId: string,
    matchId: string,
    interviewDate: Date,
    interviewType: string,
    meetingLink?: string,
  ) {
    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Only company or HR can schedule interviews
    const user = await this.usersService.findById(userId);
    if (user.data.role !== 'company' && user.data.role !== 'hr') {
      throw new ForbiddenException('Only companies or HR can schedule interviews');
    }

    match.status = 'interview_scheduled';
    match.interview = {
      scheduledDate: interviewDate,
      type: interviewType,
      meetingLink: meetingLink || '',
      status: 'scheduled',
    };
    await match.save();

    // Send interview notification
    await this.mailService.sendInterviewScheduledEmail(
      match.internId.toString(),
      match.companyId.toString(),
      'Requirement',
      String(interviewDate),
      interviewType,
      meetingLink,
    );

    return {
      success: true,
      message: 'Interview scheduled successfully',
      data: match,
    };
  }

  async makeOffer(userId: string, matchId: string, offerData: any) {
    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Check if user is authorized
    if (match.companyId.toString() !== userId) {
      throw new ForbiddenException('Only the company can make offers');
    }

    if (match.status !== 'interview_scheduled' && match.status !== 'interview_completed') {
      throw new BadRequestException('Cannot make offer at this stage');
    }

    match.status = 'offer_made';
    match.offer = {
      amount: offerData.amount,
      currency: offerData.currency || 'INR',
      period: offerData.period || 'monthly',
      startDate: offerData.startDate,
      duration: offerData.duration,
      position: offerData.position,
      benefits: offerData.benefits || [],
      status: 'pending',
      sentAt: new Date(),
    };
    await match.save();

    // Send offer notification
    await this.mailService.sendOfferEmail(
      match.internId.toString(),
      match.companyId.toString(),
      offerData,
    );

    return {
      success: true,
      message: 'Offer made successfully',
      data: match,
    };
  }

  async hireIntern(userId: string, matchId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Check if user is authorized
    if (match.companyId.toString() !== userId) {
      throw new ForbiddenException('Only the company can hire interns');
    }

    if (match.status !== 'offer_accepted') {
      throw new BadRequestException('Cannot hire before offer is accepted');
    }

    match.status = 'hired';
    match.hiredAt = new Date();
    await match.save();

    // Update intern status
    await this.internsService.updateStatus(match.internId.toString(), 'placed');

    // Send hiring confirmation
    await this.mailService.sendHiringConfirmationEmail(
      match.internId.toString(),
      match.companyId.toString(),
    );

    return {
      success: true,
      message: 'Intern hired successfully',
      data: match,
    };
  }

  async batchMatch(requirementId: string, internIds: string[]) {
    const matches = [];

    for (const internId of internIds) {
      const match = await this.createMatch(internId, requirementId);
      if (match) {
        matches.push(match);
      }
    }

    return {
      success: true,
      message: `Batch matching completed. ${matches.length} matches created.`,
      data: matches,
    };
  }

  async getStats() {
    const [
      total,
      byStatus,
      averageScore,
      successfulHires,
    ] = await Promise.all([
      this.matchModel.countDocuments(),
      this.matchModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.matchModel.aggregate([
        { $group: { _id: null, average: { $avg: '$matchScore' } } },
      ]),
      this.matchModel.countDocuments({ status: 'hired' }),
    ]);

    return {
      success: true,
      data: {
        total,
        byStatus,
        averageScore: averageScore[0]?.average || 0,
        successfulHires,
      },
    };
  }

  private async findInternMatches(userId: string, matchRequestDto: MatchRequestDto) {
    // Get intern profile
    const profile = await this.internsService.getProfile(userId);
    const internData = profile.data;

    // Get all published requirements
    const requirements = await this.companiesService.findAll({
      page: 1,
      limit: 100,
      status: 'published',
    });

    const matches = [];

    for (const req of requirements.data) {
      const matchScore = await this.calculateMatchScore(internData, req);
      if (matchScore >= matchRequestDto.minScore || 50) {
        matches.push({
          internId: userId,
          companyId: (req as any).companyId || (req as any).company || (req as any).userId,
          requirementId: (req as any).id || (req as any)._id,
          matchScore,
          status: 'pending',
        });
      }
    }

    return matches;
  }

  private async findCompanyMatches(userId: string, matchRequestDto: MatchRequestDto) {
    // Get company requirements
    const requirements = await this.companiesService.getRequirements(
      matchRequestDto.companyId || userId,
    );

    const allMatches = [];

    for (const req of requirements.data) {
      // Get all interns with sufficient readiness
      const interns = await this.internsService.findAll({
        page: 1,
        limit: 100,
        status: 'ready',
      });

      const matches = [];

      for (const intern of interns.data) {
        const matchScore = await this.calculateMatchScore(intern, req);
        if (matchScore >= matchRequestDto.minScore || 50) {
          matches.push({
            internId: intern.userId._id,
            companyId: userId,
            requirementId: req.id,
            matchScore,
            status: 'pending',
          });
        }
      }

      allMatches.push(...matches);
    }

    return allMatches;
  }

  private async calculateMatchScore(intern: any, requirement: any): Promise<number> {
    let score = 0;

    // Skill match (40%)
    const skillMatch = await this.skillMatcher.calculateMatch(
      intern.professionalInfo.skills || [],
      requirement.skills || [],
    );
    score += skillMatch * 0.4;

    // Readiness score (30%)
    const readiness = await this.internsService.getReadiness(intern.userId);
    const readinessScore = readiness.data?.overall || 0;
    score += (readinessScore / 100) * 30;

    // Experience match (15%)
    const experienceMatch = await this.skillMatcher.calculateExperienceMatch(
      intern.professionalInfo.experience || [],
      requirement.experience || { min: 0 },
    );
    score += experienceMatch * 0.15;

    // Preferences match (15%)
    const preferenceMatch = await this.skillMatcher.calculatePreferenceMatch(
      intern.preferences || {},
      requirement,
    );
    score += preferenceMatch * 0.15;

    return Math.round(Math.min(score, 100));
  }

  private async saveMatches(matches: any[], userId: string) {
    const savedMatches = [];

    for (const matchData of matches) {
      // Check if match already exists
      const existingMatch = await this.matchModel.findOne({
        internId: matchData.internId,
        companyId: matchData.companyId,
        requirementId: matchData.requirementId,
        status: { $nin: ['rejected', 'hired'] },
      });

      if (!existingMatch) {
        const match = new this.matchModel(matchData);
        await match.save();
        savedMatches.push(match);
      }
    }

    return savedMatches;
  }

  private async createMatch(internId: string, requirementId: string) {
    const intern = await this.internsService.findById(internId);
    const requirement = await this.companiesService.getRequirements(
      requirementId,
    );

    if (!intern || !requirement.data.length) {
      return null;
    }

    const matchScore = await this.calculateMatchScore(
      intern.data,
      requirement.data[0],
    );

    const match = new this.matchModel({
      internId,
      companyId: requirement.data[0].companyId,
      requirementId,
      matchScore,
      status: 'pending',
    });

    return match.save();
  }
}