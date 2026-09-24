import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Types, Connection } from 'mongoose';
import {
  InternshipApplication,
  InternshipApplicationDocument,
  ApplicationWorkflowStatus,
} from './schemas/internship-application.schema';
import {
  CreateApplicationDto,
  ScheduleInterviewDto,
  AddNoteDto,
  UpdateStatusDto,
} from './dto/create-application.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { MailService } from '../../common/mail/mail.service';
import { UserRole } from '@interhive/shared';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);
  constructor(
    @InjectModel(InternshipApplication.name)
    private applicationModel: Model<InternshipApplicationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectConnection()
    private readonly connection: Connection,
    private mailService: MailService,
  ) {}

  async create(dto: CreateApplicationDto) {
    const cleanEmail = dto.email.toLowerCase().trim();

    // Check if an application already exists with this email
    const existing = await this.applicationModel.findOne({ email: cleanEmail });
    if (existing && existing.status !== 'rejected') {
      throw new ConflictException(
        'An active internship application already exists with this email address. Our HR team will contact you once reviewed.',
      );
    }

    const application = new this.applicationModel({
      ...dto,
      email: cleanEmail,
      status: 'new',
      accountCreated: false,
    });

    await application.save();

    // Send confirmation email to the applicant
    try {
      await this.mailService.sendApplicationReceivedEmail(cleanEmail, dto.fullName);
    } catch (mailErr) {
      console.error('Failed to send application confirmation email:', mailErr);
    }

    return {
      success: true,
      message: 'Your internship application has been submitted successfully! The HR team will review your profile.',
      data: application,
    };
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Number(params.limit) || 20);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (params.status && params.status !== 'all') {
      query.status = params.status;
    }

    if (params.search) {
      const regex = new RegExp(params.search.trim(), 'i');
      query.$or = [
        { fullName: regex },
        { email: regex },
        { institution: regex },
        { degree: regex },
        { skills: regex },
        { rollNumber: regex },
      ];
    }

    const [applications, total] = await Promise.all([
      this.applicationModel
        .find(query)
        .populate('createdUserId', 'firstName lastName email employeeId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.applicationModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      success: true,
      data: applications,
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
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid application ID');
    }

    const application = await this.applicationModel
      .findById(id)
      .populate('createdUserId', 'firstName lastName email employeeId position');

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return {
      success: true,
      data: application,
    };
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    const application = await this.applicationModel.findById(id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const prevStatus = application.status;
    application.status = updateStatusDto.status as ApplicationWorkflowStatus;
    await application.save();

    // If candidate was newly shortlisted, send notification email
    if (updateStatusDto.status === 'shortlisted' && prevStatus !== 'shortlisted') {
      try {
        await this.mailService.sendShortlistedEmail({
          to: application.email,
          fullName: application.fullName,
          position: application.degree ? `${application.degree} Intern` : undefined,
        });
        this.logger.log(`📧 Shortlisted notification email dispatched to ${application.email}`);
      } catch (err: any) {
        this.logger.error(`Failed to send shortlisted email to ${application.email}: ${err.message}`);
      }
    }

    return {
      success: true,
      message: `Application status updated to ${updateStatusDto.status}`,
      data: application,
    };
  }

  async scheduleInterview(id: string, dto: ScheduleInterviewDto) {
    const application = await this.applicationModel.findById(id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    application.interview = {
      date: dto.date,
      time: dto.time,
      mode: dto.mode || 'online',
      linkOrLocation: dto.linkOrLocation || 'Google Meet (link will be sent)',
      interviewer: dto.interviewer || 'HR Technical Panel',
      notes: dto.notes || '',
      result: 'pending',
    };

    application.status = 'interview_scheduled';
    await application.save();

    // Send interview invitation email to applicant
    try {
      await this.mailService.sendApplicationInterviewEmail({
        to: application.email,
        fullName: application.fullName,
        date: dto.date,
        time: dto.time,
        mode: dto.mode || 'online',
        linkOrLocation: dto.linkOrLocation || 'Google Meet (link will be sent)',
        interviewer: dto.interviewer,
        notes: dto.notes,
      });
      this.logger.log(`📧 Interview invitation email dispatched to ${application.email}`);
    } catch (mailErr: any) {
      this.logger.error(
        `Failed to send interview invitation email to ${application.email}: ${mailErr.message}`,
      );
    }

    return {
      success: true,
      message: 'Interview scheduled successfully and invitation email sent',
      data: application,
    };
  }

  async addNote(id: string, noteDto: AddNoteDto, authorName: string) {
    const application = await this.applicationModel.findById(id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    application.notes.push({
      author: authorName || 'HR Manager',
      text: noteDto.text,
      createdAt: new Date(),
    });

    await application.save();

    return {
      success: true,
      message: 'Note added successfully',
      data: application,
    };
  }

  async createInternAccount(id: string) {
    const application = await this.applicationModel.findById(id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.accountCreated && application.createdUserId) {
      throw new BadRequestException('An intern account has already been created for this applicant.');
    }

    const cleanEmail = application.email.toLowerCase().trim();

    // Check if user already exists
    let user = await this.userModel.findOne({ email: cleanEmail });

    // Generate credentials
    const tempPassword = `InterHive@${Math.floor(1000 + Math.random() * 9000)}!`;
    const empId = `EMP${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const nameParts = application.fullName.trim().split(' ');
    const firstName = nameParts[0] || 'Intern';
    const lastName = nameParts.slice(1).join(' ') || 'Student';

    if (!user) {
      user = new this.userModel({
        email: cleanEmail,
        employeeId: empId,
        password: tempPassword, // Will be hashed once by UserSchema.pre('save')
        firstName,
        lastName,
        phone: application.phone,
        role: UserRole.INTERN,
        skills: application.skills || [],
        position: `${application.degree || 'Engineering'} Intern`,
        education: [
          {
            degree: application.degree,
            institution: application.institution,
            year: new Date().getFullYear(),
          },
        ],
        isActive: true,
        isVerified: true,
        mustChangePassword: true,
        applicationId: application._id,
      });

      await user.save();
    } else {
      user.mustChangePassword = true;
      user.applicationId = application._id as any;
      user.role = UserRole.INTERN;
      user.password = tempPassword;
      await user.save();
    }

    // Update application record
    application.status = 'selected';
    application.accountCreated = true;
    application.createdUserId = user._id as Types.ObjectId;
    await application.save();

    // Send official email with credentials
    const appUrl = (process.env.APP_URL && !process.env.APP_URL.includes('localhost'))
      ? process.env.APP_URL
      : (process.env.NODE_ENV === 'production' ? 'https://interhive.in' : 'http://localhost:5173');
    const loginUrl = `${appUrl.replace(/\/$/, '')}/login`;

    try {
      await this.mailService.sendCredentialDeliveryEmail({
        to: cleanEmail,
        fullName: application.fullName,
        employeeId: user.employeeId,
        loginEmail: cleanEmail,
        temporaryPassword: tempPassword,
        loginUrl,
      });
    } catch (mailErr) {
      console.error('Failed to send credential delivery email:', mailErr);
    }

    return {
      success: true,
      message: `Intern account created successfully! Credentials have been sent to ${cleanEmail}.`,
      data: {
        userId: user._id,
        employeeId: user.employeeId,
        email: user.email,
        temporaryPassword: tempPassword,
        fullName: application.fullName,
      },
    };
  }

  async rejectApplication(id: string, feedback?: string) {
    const application = await this.applicationModel.findById(id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status === 'selected' && application.accountCreated) {
      throw new BadRequestException('Cannot reject an application for which an intern account has already been created.');
    }

    application.status = 'rejected' as ApplicationWorkflowStatus;
    await application.save();

    // Send rejection email
    try {
      await this.mailService.sendRejectionEmail({
        to: application.email,
        fullName: application.fullName,
        feedback: feedback?.trim() || undefined,
      });
      this.logger.log(`📧 Rejection email dispatched to ${application.email}`);
    } catch (mailErr: any) {
      this.logger.error(
        `Failed to send rejection email to ${application.email}: ${mailErr.message}`,
      );
    }

    return {
      success: true,
      message: `Application rejected and notification email sent to ${application.email}.`,
      data: application,
    };
  }

  async getStats() {
    const [total, byStatus] = await Promise.all([
      this.applicationModel.countDocuments(),
      this.applicationModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statsMap: Record<string, number> = {
      new: 0,
      under_review: 0,
      shortlisted: 0,
      interview_scheduled: 0,
      interview_completed: 0,
      selected: 0,
      rejected: 0,
    };

    byStatus.forEach((item: any) => {
      statsMap[item._id] = item.count;
    });

    return {
      success: true,
      data: {
        total,
        ...statsMap,
      },
    };
  }

  async getHrDashboardData() {
    try {
      // 1. Applications & Interview Queue
      const [allApps, totalApps, scheduledInterviews, selectedCount] = await Promise.all([
        this.applicationModel.find().sort({ createdAt: -1 }).limit(10),
        this.applicationModel.countDocuments(),
        this.applicationModel
          .find({ status: 'interview_scheduled' })
          .sort({ 'interview.date': 1, 'interview.time': 1 }),
        this.applicationModel.countDocuments({ status: 'selected' }),
      ]);

      // 2. Training programs / Sprints from DB
      const trainingCollection = this.connection.collection('trainingprograms');
      const dbSprints = await trainingCollection.find({ status: 'published' }).limit(5).toArray();

      // 3. Projects from DB
      const projectCollection = this.connection.collection('projects');
      const liveProjectsCount = await projectCollection.countDocuments({
        status: { $in: ['in_progress', 'planning', 'active'] },
      });

      // 4. Company leads from DB
      const leadsCollection = this.connection.collection('companyleads');
      const recentLeads = await leadsCollection.find().sort({ createdAt: -1 }).limit(5).toArray();

      // 5. Readiness count (score >= 80%)
      const readinessCollection = this.connection.collection('internreadinesses');
      const readyPlacementCount = await readinessCollection.countDocuments({ overall: { $gte: 80 } });

      // Format interviews for the queue
      const interviews = scheduledInterviews.map((app: any) => {
        const company = app.areasOfInterest?.[0] || 'Partner Company';
        const role = app.areasOfInterest?.[1] || app.degree || 'Full Stack Developer';
        const initials = (app.fullName || 'Candidate')
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        return {
          id: app._id.toString(),
          candidateName: app.fullName,
          email: app.email,
          phone: app.phone,
          institution: app.institution,
          degree: app.degree,
          skills: app.skills || [],
          resumeUrl: app.resumeUrl,
          avatarText: initials,
          companyName: company,
          roleTitle: role,
          interviewTime: `${app.interview?.time || '11:00 AM'} ${app.interview?.date || 'Today'}`,
          interviewDate: app.interview?.date || 'Today',
          interviewMode: app.interview?.mode || 'online',
          linkOrLocation: app.interview?.linkOrLocation || 'https://meet.google.com/interhive-interview',
          interviewer: app.interview?.interviewer || 'HR Technical Panel',
          notes: app.interview?.notes || '',
          status: app.interview?.result === 'passed' ? 'Confirmed' : 'Scheduled',
          isEmerald: app.interview?.result === 'passed' || (app.interview?.notes && app.interview.notes.includes('Confirmed')),
          rawApplication: app,
        };
      });

      // Format sprints
      const sprints = dbSprints.map((p: any) => ({
        id: p._id.toString(),
        title: p.title,
        subtitle: p.description || `${p.enrolledCount || 0} Enrolled Interns • Sprint Active`,
        daysLeft: p.daysLeft || (p.duration?.min ? Math.max(1, Math.round(p.duration.min / 3)) : 0),
        progress: p.progress || 0,
        icon: (p.category || '').toLowerCase().includes('data') ? 'code' : 'rocket',
        enrolledCount: p.enrolledCount || 0,
      }));

      return {
        success: true,
        data: {
          stats: {
            activeInterns: totalApps,
            liveProjects: liveProjectsCount,
            upcomingInterviews: scheduledInterviews.length,
            readyPlacement: readyPlacementCount > 0 ? readyPlacementCount : selectedCount,
          },
          sprints,
          interviews,
          recentApplications: allApps,
          recentLeads,
        },
      };
    } catch (err: any) {
      this.logger.error(`Failed to get HR dashboard data: ${err.message}`);
      return {
        success: false,
        message: err.message,
        data: null,
      };
    }
  }
}
