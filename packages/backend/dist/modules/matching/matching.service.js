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
exports.MatchingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const match_schema_1 = require("./schemas/match.schema");
const skill_matcher_1 = require("./algorithms/skill-matcher");
const readiness_scorer_1 = require("./algorithms/readiness-scorer");
const users_service_1 = require("../users/users.service");
const interns_service_1 = require("../interns/interns.service");
const companies_service_1 = require("../companies/companies.service");
const assessments_service_1 = require("../assessments/assessments.service");
const redis_service_1 = require("../../common/redis/redis.service");
const mail_service_1 = require("../../common/mail/mail.service");
let MatchingService = class MatchingService {
    constructor(matchModel, skillMatcher, readinessScorer, usersService, internsService, companiesService, assessmentsService, redisService, mailService) {
        this.matchModel = matchModel;
        this.skillMatcher = skillMatcher;
        this.readinessScorer = readinessScorer;
        this.usersService = usersService;
        this.internsService = internsService;
        this.companiesService = companiesService;
        this.assessmentsService = assessmentsService;
        this.redisService = redisService;
        this.mailService = mailService;
    }
    async findMatches(userId, matchRequestDto) {
        const user = await this.usersService.findById(userId);
        const userRole = user.data.role;
        let matches = [];
        if (userRole === 'intern') {
            matches = await this.findInternMatches(userId, matchRequestDto);
        }
        else if (userRole === 'company' || userRole === 'hr') {
            matches = await this.findCompanyMatches(userId, matchRequestDto);
        }
        else {
            throw new common_1.BadRequestException('Invalid user role for matching');
        }
        const savedMatches = await this.saveMatches(matches, userId);
        return {
            success: true,
            message: 'Matches found successfully',
            data: savedMatches,
        };
    }
    async getMyMatches(userId, status, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const query = {
            $or: [
                { internId: userId },
                { companyId: userId },
            ],
        };
        if (status)
            query.status = status;
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
    async getMatch(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Match not found');
        }
        const match = await this.matchModel
            .findById(id)
            .populate('internId', 'firstName lastName email employeeId profilePhoto')
            .populate('companyId', 'companyInfo.name companyInfo.logo companyInfo.description')
            .populate('requirementId', 'position department skills stipend');
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        return {
            success: true,
            data: match,
        };
    }
    async acceptMatch(userId, matchId) {
        const match = await this.matchModel.findById(matchId);
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        if (match.internId.toString() !== userId && match.companyId.toString() !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to accept this match');
        }
        if (match.status !== 'pending') {
            throw new common_1.BadRequestException('Match is not in pending status');
        }
        match.status = 'accepted';
        match.acceptedAt = new Date();
        await match.save();
        await this.mailService.sendMatchAcceptedEmail(match.internId.toString(), match.companyId.toString(), matchId);
        return {
            success: true,
            message: 'Match accepted successfully',
            data: match,
        };
    }
    async rejectMatch(userId, matchId) {
        const match = await this.matchModel.findById(matchId);
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        if (match.internId.toString() !== userId && match.companyId.toString() !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to reject this match');
        }
        if (match.status !== 'pending') {
            throw new common_1.BadRequestException('Match is not in pending status');
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
    async scheduleInterview(userId, matchId, interviewDate, interviewType, meetingLink) {
        const match = await this.matchModel.findById(matchId);
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        const user = await this.usersService.findById(userId);
        if (user.data.role !== 'company' && user.data.role !== 'hr') {
            throw new common_1.ForbiddenException('Only companies or HR can schedule interviews');
        }
        match.status = 'interview_scheduled';
        match.interview = {
            scheduledDate: interviewDate,
            type: interviewType,
            meetingLink: meetingLink || '',
            status: 'scheduled',
        };
        await match.save();
        await this.mailService.sendInterviewScheduledEmail(match.internId.toString(), match.companyId.toString(), 'Requirement', String(interviewDate), interviewType, meetingLink);
        return {
            success: true,
            message: 'Interview scheduled successfully',
            data: match,
        };
    }
    async makeOffer(userId, matchId, offerData) {
        const match = await this.matchModel.findById(matchId);
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        if (match.companyId.toString() !== userId) {
            throw new common_1.ForbiddenException('Only the company can make offers');
        }
        if (match.status !== 'interview_scheduled' && match.status !== 'interview_completed') {
            throw new common_1.BadRequestException('Cannot make offer at this stage');
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
        await this.mailService.sendOfferEmail(match.internId.toString(), match.companyId.toString(), offerData);
        return {
            success: true,
            message: 'Offer made successfully',
            data: match,
        };
    }
    async hireIntern(userId, matchId) {
        const match = await this.matchModel.findById(matchId);
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        if (match.companyId.toString() !== userId) {
            throw new common_1.ForbiddenException('Only the company can hire interns');
        }
        if (match.status !== 'offer_accepted') {
            throw new common_1.BadRequestException('Cannot hire before offer is accepted');
        }
        match.status = 'hired';
        match.hiredAt = new Date();
        await match.save();
        await this.internsService.updateStatus(match.internId.toString(), 'placed');
        await this.mailService.sendHiringConfirmationEmail(match.internId.toString(), match.companyId.toString());
        return {
            success: true,
            message: 'Intern hired successfully',
            data: match,
        };
    }
    async batchMatch(requirementId, internIds) {
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
        const [total, byStatus, averageScore, successfulHires,] = await Promise.all([
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
    async findInternMatches(userId, matchRequestDto) {
        const profile = await this.internsService.getProfile(userId);
        const internData = profile.data;
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
                    companyId: req.companyId || req.company || req.userId,
                    requirementId: req.id || req._id,
                    matchScore,
                    status: 'pending',
                });
            }
        }
        return matches;
    }
    async findCompanyMatches(userId, matchRequestDto) {
        const requirements = await this.companiesService.getRequirements(matchRequestDto.companyId || userId);
        const allMatches = [];
        for (const req of requirements.data) {
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
    async calculateMatchScore(intern, requirement) {
        let score = 0;
        const skillMatch = await this.skillMatcher.calculateMatch(intern.professionalInfo.skills || [], requirement.skills || []);
        score += skillMatch * 0.4;
        const readiness = await this.internsService.getReadiness(intern.userId);
        const readinessScore = readiness.data?.overall || 0;
        score += (readinessScore / 100) * 30;
        const experienceMatch = await this.skillMatcher.calculateExperienceMatch(intern.professionalInfo.experience || [], requirement.experience || { min: 0 });
        score += experienceMatch * 0.15;
        const preferenceMatch = await this.skillMatcher.calculatePreferenceMatch(intern.preferences || {}, requirement);
        score += preferenceMatch * 0.15;
        return Math.round(Math.min(score, 100));
    }
    async saveMatches(matches, userId) {
        const savedMatches = [];
        for (const matchData of matches) {
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
    async createMatch(internId, requirementId) {
        const intern = await this.internsService.findById(internId);
        const requirement = await this.companiesService.getRequirements(requirementId);
        if (!intern || !requirement.data.length) {
            return null;
        }
        const matchScore = await this.calculateMatchScore(intern.data, requirement.data[0]);
        const match = new this.matchModel({
            internId,
            companyId: requirement.data[0].companyId,
            requirementId,
            matchScore,
            status: 'pending',
        });
        return match.save();
    }
};
exports.MatchingService = MatchingService;
exports.MatchingService = MatchingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(match_schema_1.Match.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        skill_matcher_1.SkillMatcher,
        readiness_scorer_1.ReadinessScorer,
        users_service_1.UsersService,
        interns_service_1.InternsService,
        companies_service_1.CompaniesService,
        assessments_service_1.AssessmentsService,
        redis_service_1.RedisService,
        mail_service_1.MailService])
], MatchingService);
