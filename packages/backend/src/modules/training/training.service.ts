import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TrainingProgram, TrainingProgramDocument } from './schemas/training-program.schema';
import { TrainingModule, TrainingModuleDocument } from './schemas/training-module.schema';
import { TrainingEnrollment, TrainingEnrollmentDocument } from './schemas/training-enrollment.schema';
import { CreateTrainingDto } from './dto/create-training.dto';
import { EnrollTrainingDto } from './dto/enroll-training.dto';
import { UsersService } from '../users/users.service';
import { InternsService } from '../interns/interns.service';
import { RedisService } from '../../common/redis/redis.service';
import { MailService } from '../../common/mail/mail.service';

@Injectable()
export class TrainingService {
  constructor(
    @InjectModel(TrainingProgram.name)
    private trainingProgramModel: Model<TrainingProgramDocument>,
    @InjectModel(TrainingModule.name)
    private trainingModuleModel: Model<TrainingModuleDocument>,
    @InjectModel(TrainingEnrollment.name)
    private trainingEnrollmentModel: Model<TrainingEnrollmentDocument>,
    private usersService: UsersService,
    private internsService: InternsService,
    private redisService: RedisService,
    private mailService: MailService,
  ) {}

  async create(createTrainingDto: CreateTrainingDto) {
    const { modules, ...programData } = createTrainingDto;

    // Create training program
    const program = new this.trainingProgramModel({
      ...programData,
      status: 'draft',
      totalModules: modules.length,
    });

    await program.save();

    // Create modules
    const createdModules = await Promise.all(
      modules.map(async (module, index) => {
        const trainingModule = new this.trainingModuleModel({
          programId: program.id,
          order: index + 1,
          ...module,
        });
        return trainingModule.save();
      }),
    );

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

  async findAll(params: {
    page: number;
    limit: number;
    status?: string;
    category?: string;
    search?: string;
  }) {
    const { page, limit, status, category, search } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = category;

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

  async getAvailable(userId: string) {
    // Get programs that are published and not enrolled yet
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

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Training program not found');
    }

    const program = await this.trainingProgramModel
      .findById(id)
      .populate('modules')
      .populate('createdBy', 'firstName lastName email');

    if (!program) {
      throw new NotFoundException('Training program not found');
    }

    return {
      success: true,
      data: program,
    };
  }

  async update(id: string, updateTrainingDto: any) {
    const program = await this.trainingProgramModel.findById(id);
    if (!program) {
      throw new NotFoundException('Training program not found');
    }

    if (program.status === 'published') {
      throw new BadRequestException('Cannot update a published program');
    }

    Object.assign(program, updateTrainingDto);
    await program.save();

    return {
      success: true,
      message: 'Training program updated successfully',
      data: program,
    };
  }

  async delete(id: string) {
    const program = await this.trainingProgramModel.findById(id);
    if (!program) {
      throw new NotFoundException('Training program not found');
    }

    // Check if there are enrollments
    const enrollments = await this.trainingEnrollmentModel.countDocuments({
      programId: id,
      status: { $ne: 'withdrawn' },
    });

    if (enrollments > 0) {
      throw new BadRequestException('Cannot delete program with active enrollments');
    }

    await this.trainingModuleModel.deleteMany({ programId: id });
    await program.deleteOne();

    return {
      success: true,
      message: 'Training program deleted successfully',
    };
  }

  async publish(id: string) {
    const program = await this.trainingProgramModel.findById(id);
    if (!program) {
      throw new NotFoundException('Training program not found');
    }

    if (program.modules.length === 0) {
      throw new BadRequestException('Cannot publish program without modules');
    }

    program.status = 'published';
    await program.save();

    return {
      success: true,
      message: 'Training program published successfully',
      data: program,
    };
  }

  async enroll(userId: string, programId: string, enrollTrainingDto: EnrollTrainingDto) {
    const program = await this.trainingProgramModel.findById(programId);
    if (!program) {
      throw new NotFoundException('Training program not found');
    }

    if (program.status !== 'published') {
      throw new BadRequestException('Program is not available for enrollment');
    }

    // Check if already enrolled
    const existingEnrollment = await this.trainingEnrollmentModel.findOne({
      userId,
      programId,
      status: { $ne: 'withdrawn' },
    });

    if (existingEnrollment) {
      throw new ConflictException('Already enrolled in this program');
    }

    // Check eligibility
    const eligibility = await this.checkEligibility(userId, program);
    if (!eligibility.eligible) {
      throw new BadRequestException(eligibility.reason);
    }

    // Create enrollment
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

    // Unlock first module
    await this.unlockNextModule(enrollment.id);

    // Send notification
    await this.mailService.sendTrainingEnrollmentEmail(
      userId,
      program.title,
      enrollment.id,
    );

    return {
      success: true,
      message: 'Successfully enrolled in training program',
      data: enrollment,
    };
  }

  async getMyEnrollments(userId: string) {
    const enrollments = await this.trainingEnrollmentModel
      .find({ userId })
      .populate('programId')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: enrollments,
    };
  }

  async getEnrollment(userId: string, enrollmentId: string) {
    const enrollment = await this.trainingEnrollmentModel
      .findOne({ _id: enrollmentId, userId })
      .populate('programId')
      .populate('moduleProgress.moduleId');

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return {
      success: true,
      data: enrollment,
    };
  }

  async updateProgress(
    userId: string,
    enrollmentId: string,
    moduleId: string,
    progress: number,
  ) {
    const enrollment = await this.trainingEnrollmentModel.findOne({
      _id: enrollmentId,
      userId,
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    const moduleProgress = enrollment.moduleProgress.find(
      mp => mp.moduleId.toString() === moduleId,
    );

    if (!moduleProgress) {
      throw new NotFoundException('Module not found in enrollment');
    }

    if (moduleProgress.status === 'locked') {
      throw new ForbiddenException('Module is locked');
    }

    moduleProgress.progress = Math.min(progress, 100);

    if (progress >= 100) {
      moduleProgress.status = 'completed';
      await this.unlockNextModule(enrollmentId);
    }

    // Update overall progress
    const totalProgress = enrollment.moduleProgress.reduce(
      (sum, mp) => sum + mp.progress,
      0,
    );
    enrollment.progress = Math.round(
      (totalProgress / (enrollment.moduleProgress.length * 100)) * 100,
    );

    await enrollment.save();

    // If program is complete, update status and issue certification
    if (enrollment.progress === 100) {
      await this.completeEnrollment(userId, enrollmentId);
    }

    return {
      success: true,
      message: 'Progress updated successfully',
      data: enrollment,
    };
  }

  async completeEnrollment(userId: string, enrollmentId: string) {
    const enrollment = await this.trainingEnrollmentModel.findOne({
      _id: enrollmentId,
      userId,
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    enrollment.status = 'completed';
    enrollment.completionDate = new Date();

    // Issue certification
    enrollment.certification = {
      issued: true,
      issuedDate: new Date(),
      certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      verificationUrl: `${process.env.BASE_URL}/verify-certificate/${enrollmentId}`,
    };

    await enrollment.save();

    // Update intern readiness
    await this.internsService.recalculateReadiness(userId);

    // Send completion notification
    await this.mailService.sendTrainingCompletionEmail(
      userId,
      (enrollment.programId as any)?.title || 'Program',
      (enrollment.certification as any)?.certificateId || '',
    );

    return {
      success: true,
      message: 'Training program completed successfully',
      data: enrollment,
    };
  }

  async withdrawEnrollment(userId: string, enrollmentId: string) {
    const enrollment = await this.trainingEnrollmentModel.findOne({
      _id: enrollmentId,
      userId,
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.status === 'completed') {
      throw new BadRequestException('Cannot withdraw from completed program');
    }

    enrollment.status = 'withdrawn';
    await enrollment.save();

    return {
      success: true,
      message: 'Withdrawn from training program successfully',
    };
  }

  async getAllEnrollments(params: {
    page: number;
    limit: number;
    status?: string;
    programId?: string;
  }) {
    const { page, limit, status, programId } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) query.status = status;
    if (programId) query.programId = programId;

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
    const [
      totalPrograms,
      byStatus,
      totalEnrollments,
      byEnrollmentStatus,
      completionRate,
    ] = await Promise.all([
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

  private async checkEligibility(userId: string, program: any) {
    // Check if user has required skills
    const userProfile = await this.internsService.getProfile(userId);
    const userSkills = userProfile.data?.professionalInfo?.skills || [];

    const hasRequiredSkills = program.eligibility.requiredSkills.every(
      skill => userSkills.some(s => s.id === skill.id),
    );

    if (!hasRequiredSkills) {
      return {
        eligible: false,
        reason: 'You do not have the required skills for this program',
      };
    }

    // Check if user meets the minimum readiness score
    const readiness = await this.internsService.getReadiness(userId);
    if (readiness.data?.overall < program.eligibility.minReadinessScore) {
      return {
        eligible: false,
        reason: `Your readiness score (${readiness.data?.overall || 0}) is below the minimum required (${program.eligibility.minReadinessScore})`,
      };
    }

    return { eligible: true };
  }

  private async unlockNextModule(enrollmentId: string) {
    const enrollment = await this.trainingEnrollmentModel.findById(enrollmentId);
    if (!enrollment) return;

    // Find the first locked module
    const nextModule = enrollment.moduleProgress.find(
      mp => mp.status === 'locked' || mp.status === 'in_progress',
    );

    if (nextModule) {
      // Check if previous modules are completed
      const currentIndex = enrollment.moduleProgress.indexOf(nextModule);
      if (currentIndex === 0 || enrollment.moduleProgress[currentIndex - 1].status === 'completed') {
        nextModule.status = 'in_progress';
        await enrollment.save();
      }
    }
  }
}