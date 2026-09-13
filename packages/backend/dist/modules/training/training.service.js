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
exports.TrainingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const training_program_schema_1 = require("./schemas/training-program.schema");
const training_module_schema_1 = require("./schemas/training-module.schema");
const training_enrollment_schema_1 = require("./schemas/training-enrollment.schema");
const users_service_1 = require("../users/users.service");
const interns_service_1 = require("../interns/interns.service");
const redis_service_1 = require("../../common/redis/redis.service");
const mail_service_1 = require("../../common/mail/mail.service");
let TrainingService = class TrainingService {
    constructor(trainingProgramModel, trainingModuleModel, trainingEnrollmentModel, usersService, internsService, redisService, mailService) {
        this.trainingProgramModel = trainingProgramModel;
        this.trainingModuleModel = trainingModuleModel;
        this.trainingEnrollmentModel = trainingEnrollmentModel;
        this.usersService = usersService;
        this.internsService = internsService;
        this.redisService = redisService;
        this.mailService = mailService;
    }
    async create(createTrainingDto) {
        const { modules, ...programData } = createTrainingDto;
        const program = new this.trainingProgramModel({
            ...programData,
            status: 'draft',
            totalModules: modules.length,
        });
        await program.save();
        const createdModules = await Promise.all(modules.map(async (module, index) => {
            const trainingModule = new this.trainingModuleModel({
                programId: program.id,
                order: index + 1,
                ...module,
            });
            return trainingModule.save();
        }));
        program.modules = createdModules.map(m => m.id);
        await program.save();
        return {
            success: true,
            message: 'Training program created successfully',
            data: {
                program,
                modules: createdModules,
            },
        };
    }
    async findAll(params) {
        const { page, limit, status, category, search } = params;
        const skip = (page - 1) * limit;
        const query = {};
        if (status)
            query.status = status;
        if (category)
            query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'industry.aligned': { $regex: search, $options: 'i' } },
            ];
        }
        const [programs, total] = await Promise.all([
            this.trainingProgramModel
                .find(query)
                .populate('modules')
                .populate('createdBy', 'firstName lastName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            this.trainingProgramModel.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: programs,
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
    async getAvailable(userId) {
        const enrolledPrograms = await this.trainingEnrollmentModel.find({
            userId,
            status: { $ne: 'withdrawn' },
        }).distinct('programId');
        const programs = await this.trainingProgramModel
            .find({
            status: 'published',
            _id: { $nin: enrolledPrograms },
            'eligibility.startDate': { $lte: new Date() },
            $or: [
                { 'eligibility.endDate': { $gte: new Date() } },
                { 'eligibility.endDate': null },
            ],
        })
            .populate('modules')
            .sort({ createdAt: -1 });
        return {
            success: true,
            data: programs,
        };
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Training program not found');
        }
        const program = await this.trainingProgramModel
            .findById(id)
            .populate('modules')
            .populate('createdBy', 'firstName lastName email');
        if (!program) {
            throw new common_1.NotFoundException('Training program not found');
        }
        return {
            success: true,
            data: program,
        };
    }
    async update(id, updateTrainingDto) {
        const program = await this.trainingProgramModel.findById(id);
        if (!program) {
            throw new common_1.NotFoundException('Training program not found');
        }
        if (program.status === 'published') {
            throw new common_1.BadRequestException('Cannot update a published program');
        }
        Object.assign(program, updateTrainingDto);
        await program.save();
        return {
            success: true,
            message: 'Training program updated successfully',
            data: program,
        };
    }
    async delete(id) {
        const program = await this.trainingProgramModel.findById(id);
        if (!program) {
            throw new common_1.NotFoundException('Training program not found');
        }
        const enrollments = await this.trainingEnrollmentModel.countDocuments({
            programId: id,
            status: { $ne: 'withdrawn' },
        });
        if (enrollments > 0) {
            throw new common_1.BadRequestException('Cannot delete program with active enrollments');
        }
        await this.trainingModuleModel.deleteMany({ programId: id });
        await program.deleteOne();
        return {
            success: true,
            message: 'Training program deleted successfully',
        };
    }
    async publish(id) {
        const program = await this.trainingProgramModel.findById(id);
        if (!program) {
            throw new common_1.NotFoundException('Training program not found');
        }
        if (program.modules.length === 0) {
            throw new common_1.BadRequestException('Cannot publish program without modules');
        }
        program.status = 'published';
        await program.save();
        return {
            success: true,
            message: 'Training program published successfully',
            data: program,
        };
    }
    async enroll(userId, programId, enrollTrainingDto) {
        const program = await this.trainingProgramModel.findById(programId);
        if (!program) {
            throw new common_1.NotFoundException('Training program not found');
        }
        if (program.status !== 'published') {
            throw new common_1.BadRequestException('Program is not available for enrollment');
        }
        const existingEnrollment = await this.trainingEnrollmentModel.findOne({
            userId,
            programId,
            status: { $ne: 'withdrawn' },
        });
        if (existingEnrollment) {
            throw new common_1.ConflictException('Already enrolled in this program');
        }
        const eligibility = await this.checkEligibility(userId, program);
        if (!eligibility.eligible) {
            throw new common_1.BadRequestException(eligibility.reason);
        }
        const enrollment = new this.trainingEnrollmentModel({
            userId,
            programId,
            enrollmentDate: new Date(),
            status: 'active',
            progress: 0,
            currentModuleIndex: 0,
            moduleProgress: program.modules.map(moduleId => ({
                moduleId,
                status: 'locked',
                progress: 0,
            })),
            certification: {
                issued: false,
            },
        });
        await enrollment.save();
        await this.unlockNextModule(enrollment.id);
        await this.mailService.sendTrainingEnrollmentEmail(userId, program.title, enrollment.id);
        return {
            success: true,
            message: 'Successfully enrolled in training program',
            data: enrollment,
        };
    }
    async getMyEnrollments(userId) {
        const enrollments = await this.trainingEnrollmentModel
            .find({ userId })
            .populate('programId')
            .sort({ createdAt: -1 });
        return {
            success: true,
            data: enrollments,
        };
    }
    async getEnrollment(userId, enrollmentId) {
        const enrollment = await this.trainingEnrollmentModel
            .findOne({ _id: enrollmentId, userId })
            .populate('programId')
            .populate('moduleProgress.moduleId');
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        return {
            success: true,
            data: enrollment,
        };
    }
    async updateProgress(userId, enrollmentId, moduleId, progress) {
        const enrollment = await this.trainingEnrollmentModel.findOne({
            _id: enrollmentId,
            userId,
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        const moduleProgress = enrollment.moduleProgress.find(mp => mp.moduleId.toString() === moduleId);
        if (!moduleProgress) {
            throw new common_1.NotFoundException('Module not found in enrollment');
        }
        if (moduleProgress.status === 'locked') {
            throw new common_1.ForbiddenException('Module is locked');
        }
        moduleProgress.progress = Math.min(progress, 100);
        if (progress >= 100) {
            moduleProgress.status = 'completed';
            await this.unlockNextModule(enrollmentId);
        }
        const totalProgress = enrollment.moduleProgress.reduce((sum, mp) => sum + mp.progress, 0);
        enrollment.progress = Math.round((totalProgress / (enrollment.moduleProgress.length * 100)) * 100);
        await enrollment.save();
        if (enrollment.progress === 100) {
            await this.completeEnrollment(userId, enrollmentId);
        }
        return {
            success: true,
            message: 'Progress updated successfully',
            data: enrollment,
        };
    }
    async completeEnrollment(userId, enrollmentId) {
        const enrollment = await this.trainingEnrollmentModel.findOne({
            _id: enrollmentId,
            userId,
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        enrollment.status = 'completed';
        enrollment.completionDate = new Date();
        enrollment.certification = {
            issued: true,
            issuedDate: new Date(),
            certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            verificationUrl: `${process.env.BASE_URL}/verify-certificate/${enrollmentId}`,
        };
        await enrollment.save();
        await this.internsService.recalculateReadiness(userId);
        await this.mailService.sendTrainingCompletionEmail(userId, enrollment.programId?.title || 'Program', enrollment.certification?.certificateId || '');
        return {
            success: true,
            message: 'Training program completed successfully',
            data: enrollment,
        };
    }
    async withdrawEnrollment(userId, enrollmentId) {
        const enrollment = await this.trainingEnrollmentModel.findOne({
            _id: enrollmentId,
            userId,
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        if (enrollment.status === 'completed') {
            throw new common_1.BadRequestException('Cannot withdraw from completed program');
        }
        enrollment.status = 'withdrawn';
        await enrollment.save();
        return {
            success: true,
            message: 'Withdrawn from training program successfully',
        };
    }
    async getAllEnrollments(params) {
        const { page, limit, status, programId } = params;
        const skip = (page - 1) * limit;
        const query = {};
        if (status)
            query.status = status;
        if (programId)
            query.programId = programId;
        const [enrollments, total] = await Promise.all([
            this.trainingEnrollmentModel
                .find(query)
                .populate('userId', 'firstName lastName email')
                .populate('programId', 'title')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            this.trainingEnrollmentModel.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: enrollments,
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
    async getStats() {
        const [totalPrograms, byStatus, totalEnrollments, byEnrollmentStatus, completionRate,] = await Promise.all([
            this.trainingProgramModel.countDocuments(),
            this.trainingProgramModel.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            this.trainingEnrollmentModel.countDocuments(),
            this.trainingEnrollmentModel.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            this.trainingEnrollmentModel.aggregate([
                { $group: { _id: null, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }, total: { $sum: 1 } } },
            ]),
        ]);
        return {
            success: true,
            data: {
                programs: {
                    total: totalPrograms,
                    byStatus,
                },
                enrollments: {
                    total: totalEnrollments,
                    byStatus: byEnrollmentStatus,
                    completionRate: completionRate[0]
                        ? Math.round((completionRate[0].completed / completionRate[0].total) * 100)
                        : 0,
                },
            },
        };
    }
    async checkEligibility(userId, program) {
        const userProfile = await this.internsService.getProfile(userId);
        const userSkills = userProfile.data?.professionalInfo?.skills || [];
        const hasRequiredSkills = program.eligibility.requiredSkills.every(skill => userSkills.some(s => s.id === skill.id));
        if (!hasRequiredSkills) {
            return {
                eligible: false,
                reason: 'You do not have the required skills for this program',
            };
        }
        const readiness = await this.internsService.getReadiness(userId);
        if (readiness.data?.overall < program.eligibility.minReadinessScore) {
            return {
                eligible: false,
                reason: `Your readiness score (${readiness.data?.overall || 0}) is below the minimum required (${program.eligibility.minReadinessScore})`,
            };
        }
        return { eligible: true };
    }
    async unlockNextModule(enrollmentId) {
        const enrollment = await this.trainingEnrollmentModel.findById(enrollmentId);
        if (!enrollment)
            return;
        const nextModule = enrollment.moduleProgress.find(mp => mp.status === 'locked' || mp.status === 'in_progress');
        if (nextModule) {
            const currentIndex = enrollment.moduleProgress.indexOf(nextModule);
            if (currentIndex === 0 || enrollment.moduleProgress[currentIndex - 1].status === 'completed') {
                nextModule.status = 'in_progress';
                await enrollment.save();
            }
        }
    }
};
exports.TrainingService = TrainingService;
exports.TrainingService = TrainingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(training_program_schema_1.TrainingProgram.name)),
    __param(1, (0, mongoose_1.InjectModel)(training_module_schema_1.TrainingModule.name)),
    __param(2, (0, mongoose_1.InjectModel)(training_enrollment_schema_1.TrainingEnrollment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService,
        interns_service_1.InternsService,
        redis_service_1.RedisService,
        mail_service_1.MailService])
], TrainingService);
