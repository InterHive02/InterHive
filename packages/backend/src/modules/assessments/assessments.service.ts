import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SkillAssessment, SkillAssessmentDocument } from './schemas/skill-assessment.schema';
import { AssessmentQuestion, AssessmentQuestionDocument } from './schemas/assessment-question.schema';
import { AssessmentResult, AssessmentResultDocument } from './schemas/assessment-result.schema';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';
import { UsersService } from '../users/users.service';
import { InternsService } from '../interns/interns.service';
import { RedisService } from '../../common/redis/redis.service';
import { MailService } from '../../common/mail/mail.service';
import { AssessmentStatus, AssessmentType } from '@interhive/shared';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectModel(SkillAssessment.name)
    private assessmentModel: Model<SkillAssessmentDocument>,
    @InjectModel(AssessmentQuestion.name)
    private questionModel: Model<AssessmentQuestionDocument>,
    @InjectModel(AssessmentResult.name)
    private resultModel: Model<AssessmentResultDocument>,
    private usersService: UsersService,
    private internsService: InternsService,
    private redisService: RedisService,
    private mailService: MailService,
  ) {}

  async create(createAssessmentDto: CreateAssessmentDto) {
    const { questions, ...assessmentData } = createAssessmentDto;

    // Create assessment
    const assessment = new this.assessmentModel({
      ...assessmentData,
      totalScore: questions.reduce((sum, q) => sum + q.points, 0),
      status: 'draft',
      questions: [],
    });

    await assessment.save();

    // Create questions
    const createdQuestions = await Promise.all(
      questions.map(async (q) => {
        const question = new this.questionModel({
          assessmentId: assessment.id,
          ...q,
        });
        return question.save();
      }),
    );

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

  async findAll(params: {
    page: number;
    limit: number;
    type?: string;
    category?: string;
    status?: string;
  }) {
    const { page, limit, type, category, status } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (type) query.type = type;
    if (category) query.category = { $in: [category] };
    if (status) query.status = status;

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

  async findById(id: string) {
    const assessment = await this.assessmentModel
      .findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('questions');

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    return {
      success: true,
      data: assessment,
    };
  }

  async update(id: string, updateAssessmentDto: any) {
    const assessment = await this.assessmentModel.findById(id);
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    if (assessment.status === 'published' || assessment.status === 'active') {
      throw new BadRequestException('Cannot update a published or active assessment');
    }

    Object.assign(assessment, updateAssessmentDto);
    await assessment.save();

    return {
      success: true,
      message: 'Assessment updated successfully',
      data: assessment,
    };
  }

  async delete(id: string) {
    const assessment = await this.assessmentModel.findById(id);
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    // Delete associated questions
    await this.questionModel.deleteMany({ assessmentId: id });
    await assessment.deleteOne();

    return {
      success: true,
      message: 'Assessment deleted successfully',
    };
  }

  async publish(id: string) {
    const assessment = await this.assessmentModel.findById(id);
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    if (assessment.questions.length === 0) {
      throw new BadRequestException('Cannot publish assessment without questions');
    }

    assessment.status = 'published';
    await assessment.save();

    return {
      success: true,
      message: 'Assessment published successfully',
      data: assessment,
    };
  }

  async startAssessment(userId: string, assessmentId: string) {
    const assessment = await this.assessmentModel.findById(assessmentId);
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    if (assessment.status !== 'published' && assessment.status !== 'active') {
      throw new BadRequestException('Assessment is not available');
    }

    // Check if user already started
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
      throw new ConflictException('Assessment already completed');
    }

    // Check if user has started this assessment before
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
        throw new BadRequestException('Maximum attempts reached');
      }
    }

    // Create result
    const result = new this.resultModel({
      userId,
      assessmentId,
      startedAt: new Date(),
      status: 'in_progress',
      timeSpent: 0,
      answers: [],
    });

    await result.save();

    // Send notification
    await this.mailService.sendAssessmentStartedEmail(
      userId,
      assessment.title,
      result.id,
    );

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

  async submitAssessment(
    userId: string,
    assessmentId: string,
    submitAssessmentDto: SubmitAssessmentDto,
  ) {
    const result = await this.resultModel.findOne({
      _id: submitAssessmentDto.resultId,
      userId,
      assessmentId,
    });

    if (!result) {
      throw new NotFoundException('Assessment result not found');
    }

    if (result.status === 'completed' || result.status === 'evaluated') {
      throw new BadRequestException('Assessment already submitted');
    }

    const assessment = await this.assessmentModel.findById(assessmentId);
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    // Calculate score
    let score = 0;
    let totalQuestions = submitAssessmentDto.answers.length;

    const evaluatedAnswers = await Promise.all(
      submitAssessmentDto.answers.map(async (answer) => {
        const question = await this.questionModel.findById(answer.questionId);
        if (!question) return null;

        let isCorrect = false;
        let questionScore = 0;

        // Evaluate based on question type
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
            // Would integrate with an evaluator service
            questionScore = 0;
            isCorrect = false;
            break;
          case 'essay':
            // Manual evaluation needed
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
      }),
    );

    const validAnswers = evaluatedAnswers.filter(a => a !== null);
    const percentage = Math.round((score / assessment.totalScore) * 100);
    const passed = percentage >= assessment.passingScore;

    // Update result
    result.answers = validAnswers as any;
    result.score = score;
    result.percentage = percentage;
    result.passed = passed;
    result.completedAt = new Date();
    result.status = passed ? 'completed' : 'completed';

    // Calculate time spent
    if (result.startedAt) {
      result.timeSpent = Math.floor(
        (result.completedAt.getTime() - result.startedAt.getTime()) / 1000,
      );
    }

    await result.save();

    // Update intern readiness score
    await this.internsService.recalculateReadiness(userId);

    // Send notification
    await this.mailService.sendAssessmentCompletedEmail(
      userId,
      assessment.title,
      percentage,
      passed,
    );

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

  async getResult(userId: string, assessmentId: string) {
    const result = await this.resultModel
      .findOne({ userId, assessmentId })
      .populate('assessmentId')
      .populate('answers.questionId');

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    return {
      success: true,
      data: result,
    };
  }

  async getMyResults(userId: string) {
    const results = await this.resultModel
      .find({ userId })
      .populate('assessmentId')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: results,
    };
  }

  async getUserResults(userId: string) {
    const results = await this.resultModel
      .find({ userId })
      .populate('assessmentId')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: results,
    };
  }

  async evaluateAssessment(assessmentId: string, resultId: string, feedback: any) {
    const result = await this.resultModel.findById(resultId);
    if (!result) {
      throw new NotFoundException('Result not found');
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
    const [
      total,
      byType,
      byStatus,
      averageScore,
      passRate,
    ] = await Promise.all([
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
}