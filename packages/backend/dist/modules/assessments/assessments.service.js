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
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const skill_assessment_schema_1 = require("./schemas/skill-assessment.schema");
const assessment_question_schema_1 = require("./schemas/assessment-question.schema");
const assessment_result_schema_1 = require("./schemas/assessment-result.schema");
const users_service_1 = require("../users/users.service");
const interns_service_1 = require("../interns/interns.service");
const redis_service_1 = require("../../common/redis/redis.service");
const mail_service_1 = require("../../common/mail/mail.service");
let AssessmentsService = class AssessmentsService {
    constructor(assessmentModel, questionModel, resultModel, usersService, internsService, redisService, mailService) {
        this.assessmentModel = assessmentModel;
        this.questionModel = questionModel;
        this.resultModel = resultModel;
        this.usersService = usersService;
        this.internsService = internsService;
        this.redisService = redisService;
        this.mailService = mailService;
    }
    async create(createAssessmentDto) {
        const { questions, ...assessmentData } = createAssessmentDto;
        const assessment = new this.assessmentModel({
            ...assessmentData,
            totalScore: questions.reduce((sum, q) => sum + q.points, 0),
            status: 'draft',
            questions: [],
        });
        await assessment.save();
        const createdQuestions = await Promise.all(questions.map(async (q) => {
            const question = new this.questionModel({
                assessmentId: assessment.id,
                ...q,
            });
            return question.save();
        }));
        assessment.questions = createdQuestions.map(q => q.id);
        await assessment.save();
        return {
            success: true,
            message: 'Assessment created successfully',
            data: {
                assessment,
                questions: createdQuestions,
            },
        };
    }
    async findAll(params) {
        const { page, limit, type, category, status } = params;
        const skip = (page - 1) * limit;
        const query = {};
        if (type)
            query.type = type;
        if (category)
            query.category = { $in: [category] };
        if (status)
            query.status = status;
        const [assessments, total] = await Promise.all([
            this.assessmentModel
                .find(query)
                .populate('createdBy', 'firstName lastName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            this.assessmentModel.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: assessments,
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
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Assessment not found');
        }
        const assessment = await this.assessmentModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('questions');
        if (!assessment) {
            throw new common_1.NotFoundException('Assessment not found');
        }
        return {
            success: true,
            data: assessment,
        };
    }
    async update(id, updateAssessmentDto) {
        const assessment = await this.assessmentModel.findById(id);
        if (!assessment) {
            throw new common_1.NotFoundException('Assessment not found');
        }
        if (assessment.status === 'published' || assessment.status === 'active') {
            throw new common_1.BadRequestException('Cannot update a published or active assessment');
        }
        Object.assign(assessment, updateAssessmentDto);
        await assessment.save();
        return {
            success: true,
            message: 'Assessment updated successfully',
            data: assessment,
        };
    }
    async delete(id) {
        const assessment = await this.assessmentModel.findById(id);
        if (!assessment) {
            throw new common_1.NotFoundException('Assessment not found');
        }
        await this.questionModel.deleteMany({ assessmentId: id });
        await assessment.deleteOne();
        return {
            success: true,
            message: 'Assessment deleted successfully',
        };
    }
    async publish(id) {
        const assessment = await this.assessmentModel.findById(id);
        if (!assessment) {
            throw new common_1.NotFoundException('Assessment not found');
        }
        if (assessment.questions.length === 0) {
            throw new common_1.BadRequestException('Cannot publish assessment without questions');
        }
        assessment.status = 'published';
        await assessment.save();
        return {
            success: true,
            message: 'Assessment published successfully',
            data: assessment,
        };
    }
    async startAssessment(userId, assessmentId) {
        const assessment = await this.assessmentModel.findById(assessmentId);
        if (!assessment) {
            throw new common_1.NotFoundException('Assessment not found');
        }
        if (assessment.status !== 'published' && assessment.status !== 'active') {
            throw new common_1.BadRequestException('Assessment is not available');
        }
        const existingResult = await this.resultModel.findOne({
            userId,
            assessmentId,
            status: { $in: ['in_progress', 'completed'] },
        });
        if (existingResult) {
            if (existingResult.status === 'in_progress') {
                return {
                    success: true,
                    message: 'Assessment already in progress',
                    data: existingResult,
                };
            }
            throw new common_1.ConflictException('Assessment already completed');
        }
        const previousAttempt = await this.resultModel.findOne({
            userId,
            assessmentId,
        });
        if (previousAttempt && assessment.maxAttempts) {
            const attempts = await this.resultModel.countDocuments({
                userId,
                assessmentId,
            });
            if (attempts >= assessment.maxAttempts) {
                throw new common_1.BadRequestException('Maximum attempts reached');
            }
        }
        const result = new this.resultModel({
            userId,
            assessmentId,
            startedAt: new Date(),
            status: 'in_progress',
            timeSpent: 0,
            answers: [],
        });
        await result.save();
        await this.mailService.sendAssessmentStartedEmail(userId, assessment.title, result.id);
        return {
            success: true,
            message: 'Assessment started successfully',
            data: {
                resultId: result.id,
                assessment,
                timeLimit: assessment.duration,
            },
        };
    }
    async submitAssessment(userId, assessmentId, submitAssessmentDto) {
        const result = await this.resultModel.findOne({
            _id: submitAssessmentDto.resultId,
            userId,
            assessmentId,
        });
        if (!result) {
            throw new common_1.NotFoundException('Assessment result not found');
        }
        if (result.status === 'completed' || result.status === 'evaluated') {
            throw new common_1.BadRequestException('Assessment already submitted');
        }
        const assessment = await this.assessmentModel.findById(assessmentId);
        if (!assessment) {
            throw new common_1.NotFoundException('Assessment not found');
        }
        let score = 0;
        let totalQuestions = submitAssessmentDto.answers.length;
        const evaluatedAnswers = await Promise.all(submitAssessmentDto.answers.map(async (answer) => {
            const question = await this.questionModel.findById(answer.questionId);
            if (!question)
                return null;
            let isCorrect = false;
            let questionScore = 0;
            switch (question.type) {
                case 'multiple_choice':
                    isCorrect = answer.answer === question.correctAnswer;
                    questionScore = isCorrect ? question.points : 0;
                    break;
                case 'multiple_select':
                    const selected = Array.isArray(answer.answer) ? answer.answer : [];
                    const correct = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
                    isCorrect = selected.length === correct.length &&
                        selected.every(a => correct.includes(a));
                    questionScore = isCorrect ? question.points : 0;
                    break;
                case 'coding':
                    questionScore = 0;
                    isCorrect = false;
                    break;
                case 'essay':
                    questionScore = 0;
                    isCorrect = false;
                    break;
                default:
                    questionScore = 0;
            }
            score += questionScore;
            return {
                questionId: answer.questionId,
                answer: answer.answer,
                isCorrect,
                score: questionScore,
            };
        }));
        const validAnswers = evaluatedAnswers.filter(a => a !== null);
        const percentage = Math.round((score / assessment.totalScore) * 100);
        const passed = percentage >= assessment.passingScore;
        result.answers = validAnswers;
        result.score = score;
        result.percentage = percentage;
        result.passed = passed;
        result.completedAt = new Date();
        result.status = passed ? 'completed' : 'completed';
        if (result.startedAt) {
            result.timeSpent = Math.floor((result.completedAt.getTime() - result.startedAt.getTime()) / 1000);
        }
        await result.save();
        await this.internsService.recalculateReadiness(userId);
        await this.mailService.sendAssessmentCompletedEmail(userId, assessment.title, percentage, passed);
        return {
            success: true,
            message: 'Assessment submitted successfully',
            data: {
                result,
                score,
                percentage,
                passed,
            },
        };
    }
    async getResult(userId, assessmentId) {
        const result = await this.resultModel
            .findOne({ userId, assessmentId })
            .populate('assessmentId')
            .populate('answers.questionId');
        if (!result) {
            throw new common_1.NotFoundException('Result not found');
        }
        return {
            success: true,
            data: result,
        };
    }
    async getMyResults(userId) {
        const results = await this.resultModel
            .find({ userId })
            .populate('assessmentId')
            .sort({ createdAt: -1 });
        return {
            success: true,
            data: results,
        };
    }
    async getUserResults(userId) {
        const results = await this.resultModel
            .find({ userId })
            .populate('assessmentId')
            .sort({ createdAt: -1 });
        return {
            success: true,
            data: results,
        };
    }
    async evaluateAssessment(assessmentId, resultId, feedback) {
        const result = await this.resultModel.findById(resultId);
        if (!result) {
            throw new common_1.NotFoundException('Result not found');
        }
        result.feedback = feedback;
        result.status = 'evaluated';
        await result.save();
        return {
            success: true,
            message: 'Assessment evaluated successfully',
            data: result,
        };
    }
    async getStats() {
        const [total, byType, byStatus, averageScore, passRate,] = await Promise.all([
            this.assessmentModel.countDocuments(),
            this.assessmentModel.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } },
            ]),
            this.assessmentModel.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            this.resultModel.aggregate([
                { $group: { _id: null, average: { $avg: '$percentage' } } },
            ]),
            this.resultModel.aggregate([
                { $group: { _id: '$passed', count: { $sum: 1 } } },
            ]),
        ]);
        return {
            success: true,
            data: {
                total,
                byType,
                byStatus,
                averageScore: averageScore[0]?.average || 0,
                passRate: passRate.find(p => p._id === true)?.count || 0,
            },
        };
    }
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(skill_assessment_schema_1.SkillAssessment.name)),
    __param(1, (0, mongoose_1.InjectModel)(assessment_question_schema_1.AssessmentQuestion.name)),
    __param(2, (0, mongoose_1.InjectModel)(assessment_result_schema_1.AssessmentResult.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService,
        interns_service_1.InternsService,
        redis_service_1.RedisService,
        mail_service_1.MailService])
], AssessmentsService);
