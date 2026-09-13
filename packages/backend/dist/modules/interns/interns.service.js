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
exports.InternsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const intern_profile_schema_1 = require("./schemas/intern-profile.schema");
const intern_application_schema_1 = require("./schemas/intern-application.schema");
const intern_readiness_schema_1 = require("./schemas/intern-readiness.schema");
const users_service_1 = require("../users/users.service");
const redis_service_1 = require("../../common/redis/redis.service");
const mail_service_1 = require("../../common/mail/mail.service");
const shared_1 = require("@interhive/shared");
let InternsService = class InternsService {
    constructor(internProfileModel, internApplicationModel, internReadinessModel, usersService, redisService, mailService) {
        this.internProfileModel = internProfileModel;
        this.internApplicationModel = internApplicationModel;
        this.internReadinessModel = internReadinessModel;
        this.usersService = usersService;
        this.redisService = redisService;
        this.mailService = mailService;
    }
    async createProfile(userId, createProfileDto) {
        const existingProfile = await this.internProfileModel.findOne({ userId });
        if (existingProfile) {
            throw new common_1.ConflictException('Intern profile already exists');
        }
        const profile = new this.internProfileModel({
            userId,
            personalInfo: createProfileDto.personalInfo,
            contact: createProfileDto.contact,
            academicInfo: createProfileDto.academicInfo,
            professionalInfo: createProfileDto.professionalInfo,
            preferences: createProfileDto.preferences,
            status: shared_1.InternStatus.REGISTERED,
        });
        await profile.save();
        await this.initializeReadiness(userId);
        return {
            success: true,
            message: 'Intern profile created successfully',
            data: profile,
        };
    }
    async getProfile(userId) {
        let profile = await this.internProfileModel
            .findOne({ userId })
            .populate('userId', 'firstName lastName email role');
        if (!profile) {
            try {
                const userRes = await this.usersService.findById(userId);
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
                    status: shared_1.InternStatus.REGISTERED,
                });
                await profile.save();
                profile = await this.internProfileModel
                    .findOne({ userId })
                    .populate('userId', 'firstName lastName email role');
            }
            catch (err) {
                return {
                    success: true,
                    data: {
                        userId,
                        personalInfo: { firstName: 'Intern', lastName: 'User', email: '' },
                        professionalInfo: { skills: [], experience: [] },
                        status: shared_1.InternStatus.REGISTERED,
                    },
                };
            }
        }
        return {
            success: true,
            data: profile,
        };
    }
    async updateProfile(userId, updateProfileDto) {
        const profile = await this.internProfileModel.findOne({ userId });
        if (!profile) {
            throw new common_1.NotFoundException('Intern profile not found');
        }
        Object.assign(profile, updateProfileDto);
        await profile.save();
        return {
            success: true,
            message: 'Profile updated successfully',
            data: profile,
        };
    }
    async getReadiness(userId) {
        let readiness = await this.internReadinessModel.findOne({ userId });
        if (!readiness) {
            try {
                await this.initializeReadiness(userId);
                readiness = await this.internReadinessModel.findOne({ userId });
            }
            catch (err) {
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
    async apply(userId, programId, coverLetter) {
        const profile = await this.internProfileModel.findOne({ userId });
        if (!profile) {
            throw new common_1.NotFoundException('Intern profile not found');
        }
        const existingApplication = await this.internApplicationModel.findOne({
            userId,
            programId,
            status: { $nin: [shared_1.ApplicationStatus.WITHDRAWN, shared_1.ApplicationStatus.REJECTED] },
        });
        if (existingApplication) {
            throw new common_1.ConflictException('Already applied to this program');
        }
        const application = new this.internApplicationModel({
            userId,
            programId,
            coverLetter,
            status: shared_1.ApplicationStatus.PENDING,
        });
        await application.save();
        await this.mailService.sendApplicationConfirmation(profile.userId?.email || '', profile.personalInfo?.firstName || 'Intern', programId);
        return {
            success: true,
            message: 'Application submitted successfully',
            data: application,
        };
    }
    async getApplications(userId, status) {
        const query = { userId };
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
    async getApplication(userId, applicationId) {
        const application = await this.internApplicationModel
            .findOne({ _id: applicationId, userId })
            .populate('programId', 'title description duration');
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        return {
            success: true,
            data: application,
        };
    }
    async withdrawApplication(userId, applicationId) {
        const application = await this.internApplicationModel.findOne({
            _id: applicationId,
            userId,
        });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (application.status !== shared_1.ApplicationStatus.PENDING) {
            throw new common_1.BadRequestException('Cannot withdraw application at this stage');
        }
        application.status = shared_1.ApplicationStatus.WITHDRAWN;
        await application.save();
        return {
            success: true,
            message: 'Application withdrawn successfully',
        };
    }
    async getOpportunities(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const profile = await this.internProfileModel.findOne({ userId });
        if (!profile) {
            throw new common_1.NotFoundException('Intern profile not found');
        }
        const readiness = await this.internReadinessModel.findOne({ userId });
        const opportunities = await this.internApplicationModel
            .find({
            userId: { $ne: userId },
            status: shared_1.ApplicationStatus.PENDING,
            'programId.skills': { $in: profile.professionalInfo.skills },
        })
            .populate('userId', 'firstName lastName email')
            .populate('programId')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.internApplicationModel.countDocuments({
            userId: { $ne: userId },
            status: shared_1.ApplicationStatus.PENDING,
            'programId.skills': { $in: profile.professionalInfo.skills },
        });
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
    async onboard(userId, programId) {
        const profile = await this.internProfileModel.findOne({ userId });
        if (!profile) {
            throw new common_1.NotFoundException('Intern profile not found');
        }
        const application = await this.internApplicationModel.findOne({
            userId,
            programId,
            status: shared_1.ApplicationStatus.OFFERED,
        });
        if (!application) {
            throw new common_1.BadRequestException('No offer found for this program');
        }
        application.status = shared_1.ApplicationStatus.ACCEPTED;
        await application.save();
        profile.status = shared_1.InternStatus.PROJECT;
        await profile.save();
        await this.recalculateReadiness(userId);
        await this.mailService.sendOnboardingEmail(profile.userId?.email || '', profile.personalInfo?.firstName || 'Intern', programId);
        return {
            success: true,
            message: 'Successfully onboarded to program',
        };
    }
    async findAll(params) {
        const { page, limit, status, search } = params;
        const skip = (page - 1) * limit;
        const query = {};
        if (status)
            query.status = status;
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
    async findById(id) {
        const profile = await this.internProfileModel
            .findById(id)
            .populate('userId', 'firstName lastName email role');
        if (!profile) {
            throw new common_1.NotFoundException('Intern not found');
        }
        return {
            success: true,
            data: profile,
        };
    }
    async recalculateReadiness(userId) {
        const profile = await this.internProfileModel.findOne({ userId });
        if (!profile) {
            throw new common_1.NotFoundException('Intern profile not found');
        }
        const applications = await this.internApplicationModel.find({ userId });
        const technicalScore = this.calculateTechnicalScore(profile);
        const projectScore = this.calculateProjectScore(applications);
        const communicationScore = this.calculateCommunicationScore(profile);
        const problemSolvingScore = this.calculateProblemSolvingScore(profile);
        const workflowScore = this.calculateWorkflowScore(profile);
        const collaborationScore = this.calculateCollaborationScore(profile);
        const overall = Math.round((technicalScore + projectScore + communicationScore +
            problemSolvingScore + workflowScore + collaborationScore) / 6);
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
        }
        else {
            await this.initializeReadiness(userId);
        }
        return {
            success: true,
            message: 'Readiness score recalculated successfully',
        };
    }
    async updateStatus(id, status) {
        const profile = await this.internProfileModel.findById(id);
        if (!profile) {
            throw new common_1.NotFoundException('Intern not found');
        }
        profile.status = status;
        await profile.save();
        return {
            success: true,
            message: 'Status updated successfully',
            data: profile,
        };
    }
    async uploadResume(userId, file) {
        const profile = await this.internProfileModel.findOne({ userId });
        if (!profile) {
            throw new common_1.NotFoundException('Intern profile not found');
        }
        profile.professionalInfo.resume = file.path || file.filename;
        await profile.save();
        return {
            success: true,
            message: 'Resume uploaded successfully',
        };
    }
    async deleteResume(userId) {
        const profile = await this.internProfileModel.findOne({ userId });
        if (!profile) {
            throw new common_1.NotFoundException('Intern profile not found');
        }
        profile.professionalInfo.resume = null;
        await profile.save();
        return {
            success: true,
            message: 'Resume deleted successfully',
        };
    }
    async getStats() {
        const [total, byStatus, byProgram, averageReadiness,] = await Promise.all([
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
    async initializeReadiness(userId) {
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
    calculateMatchScore(profile, readiness, opportunity) {
        let score = 0;
        const maxScore = 100;
        const skillsMatch = opportunity.programId.skills.filter(skill => profile.professionalInfo.skills.includes(skill)).length;
        const skillScore = (skillsMatch / opportunity.programId.skills.length) * 40;
        score += skillScore;
        if (readiness) {
            score += (readiness.overall / 100) * 30;
        }
        const experienceMatch = profile.professionalInfo.experience.filter(exp => opportunity.programId.skills.some(skill => exp.skills?.includes(skill))).length;
        const expScore = Math.min((experienceMatch / 3) * 20, 20);
        score += expScore;
        let prefScore = 0;
        if (profile.preferences.preferredDomains.some(domain => opportunity.programId.category.includes(domain))) {
            prefScore += 5;
        }
        if (profile.preferences.preferredWorkType.includes(opportunity.programId.workType)) {
            prefScore += 5;
        }
        score += prefScore;
        return Math.round(score);
    }
    calculateTechnicalScore(profile) {
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
    calculateProjectScore(applications) {
        if (applications.length === 0)
            return 0;
        const completed = applications.filter(a => a.status === shared_1.ApplicationStatus.ACCEPTED);
        return Math.min(Math.round((completed.length / applications.length) * 100), 100);
    }
    calculateCommunicationScore(profile) {
        let score = 50;
        if (profile.personalInfo.firstName && profile.personalInfo.lastName)
            score += 10;
        if (profile.contact.email)
            score += 10;
        if (profile.contact.phone)
            score += 10;
        if (profile.professionalInfo.resume)
            score += 10;
        if (profile.professionalInfo.portfolio)
            score += 10;
        return Math.min(score, 100);
    }
    calculateProblemSolvingScore(profile) {
        let score = 40;
        if (profile.academicInfo.cgpa) {
            score += Math.min(profile.academicInfo.cgpa / 4 * 30, 30);
        }
        if (profile.professionalInfo.experience.length > 0) {
            score += 30;
        }
        return Math.min(score, 100);
    }
    calculateWorkflowScore(profile) {
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
    calculateCollaborationScore(profile) {
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
    calculateLeadershipScore(profile) {
        let score = 40;
        const leadershipRoles = profile.professionalInfo.experience.filter(e => e.position.includes('lead') || e.position.includes('manager'));
        if (leadershipRoles.length > 0) {
            score += 30;
        }
        if (profile.professionalInfo.skills.some(s => s.name === 'leadership')) {
            score += 30;
        }
        return Math.min(score, 100);
    }
    calculateAdaptabilityScore(profile) {
        let score = 50;
        const skillCount = profile.professionalInfo.skills.length;
        if (skillCount > 5)
            score += 20;
        if (profile.professionalInfo.experience.length > 2)
            score += 20;
        if (profile.professionalInfo.certifications?.length > 0)
            score += 10;
        return Math.min(score, 100);
    }
};
exports.InternsService = InternsService;
exports.InternsService = InternsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(intern_profile_schema_1.InternProfile.name)),
    __param(1, (0, mongoose_1.InjectModel)(intern_application_schema_1.InternApplication.name)),
    __param(2, (0, mongoose_1.InjectModel)(intern_readiness_schema_1.InternReadiness.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService,
        redis_service_1.RedisService,
        mail_service_1.MailService])
], InternsService);
