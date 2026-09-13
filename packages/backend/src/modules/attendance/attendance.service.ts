import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { UsersService } from '../users/users.service';
import { RedisService } from '../../common/redis/redis.service';
import { AttendanceStatus } from '@interhive/shared';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    private usersService: UsersService,
    private redisService: RedisService,
  ) {}

  async checkIn(userId: string, checkInDto: CheckInDto) {
    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await this.attendanceModel.findOne({
      userId,
      date: today,
    });

    if (existingAttendance && existingAttendance.checkIn) {
      throw new BadRequestException('Already checked in today');
    }

    // Get user info
    const user = await this.usersService.findById(userId);

    // Check if late
    const checkInTime = new Date();
    const startTime = new Date();
    startTime.setHours(9, 0, 0); // 9:00 AM

    const isLate = checkInTime > startTime;
    const lateMinutes = isLate ? Math.floor((checkInTime.getTime() - startTime.getTime()) / (1000 * 60)) : 0;

    // Create attendance record
    const attendance = new this.attendanceModel({
      userId,
      date: today,
      checkIn: {
        time: checkInTime,
        location: checkInDto.location,
        ip: checkInDto.ip,
        deviceInfo: checkInDto.deviceInfo,
        screenshot: checkInDto.screenshot,
        notes: checkInDto.notes,
      },
      status: isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
      lateLogin: {
        isLate,
        minutes: lateMinutes,
        reason: checkInDto.reason,
      },
      workingHours: {
        scheduled: 8,
        actual: 0,
        overtime: 0,
        breakTime: 0,
        totalHours: 0,
      },
    });

    await attendance.save();

    // Store check-in status in Redis for quick access
    await this.redisService.set(
      `attendance:checkin:${userId}`,
      'true',
      86400, // 24 hours
    );

    return {
      success: true,
      message: isLate ? 'Checked in late' : 'Check in successful',
      data: attendance,
    };
  }

  async checkOut(userId: string, checkOutDto: CheckOutDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.attendanceModel.findOne({
      userId,
      date: today,
    });

    if (!attendance) {
      throw new BadRequestException('No check-in found for today');
    }

    if (attendance.checkOut) {
      throw new BadRequestException('Already checked out today');
    }

    const checkOutTime = new Date();

    // Check if early logout
    const endTime = new Date();
    endTime.setHours(18, 0, 0); // 6:00 PM

    const isEarly = checkOutTime < endTime;
    const earlyMinutes = isEarly ? Math.floor((endTime.getTime() - checkOutTime.getTime()) / (1000 * 60)) : 0;

    // Calculate working hours
    const checkInTime = new Date(attendance.checkIn.time);
    let totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    // Subtract lunch break
    if (attendance.lunchBreak && attendance.lunchBreak.start && attendance.lunchBreak.end) {
      const lunchDuration = (new Date(attendance.lunchBreak.end).getTime() - 
        new Date(attendance.lunchBreak.start).getTime()) / (1000 * 60 * 60);
      totalHours -= lunchDuration;
    }

    // Update attendance
    attendance.checkOut = {
      time: checkOutTime,
      location: checkOutDto.location,
      ip: checkOutDto.ip,
      deviceInfo: checkOutDto.deviceInfo,
      screenshot: checkOutDto.screenshot,
      notes: checkOutDto.notes,
    };

    attendance.earlyLogout = {
      isEarly,
      minutes: earlyMinutes,
      reason: checkOutDto.reason,
    };

    attendance.workingHours = {
      scheduled: 8,
      actual: parseFloat(totalHours.toFixed(2)),
      overtime: totalHours > 8 ? parseFloat((totalHours - 8).toFixed(2)) : 0,
      breakTime: attendance.lunchBreak?.duration || 0,
      totalHours: parseFloat(totalHours.toFixed(2)),
    };

    await attendance.save();

    // Remove check-in status from Redis
    await this.redisService.del(`attendance:checkin:${userId}`);

    return {
      success: true,
      message: 'Check out successful',
      data: attendance,
    };
  }

  async startLunch(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.attendanceModel.findOne({
      userId,
      date: today,
    });

    if (!attendance) {
      throw new BadRequestException('Please check in first');
    }

    if (!attendance.checkIn) {
      throw new BadRequestException('Please check in first');
    }

    if (attendance.lunchBreak && attendance.lunchBreak.start) {
      throw new BadRequestException('Lunch break already started');
    }

    attendance.lunchBreak = {
      start: new Date(),
      end: null,
      duration: 0,
    };

    await attendance.save();

    return {
      success: true,
      message: 'Lunch break started',
      data: attendance,
    };
  }

  async endLunch(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.attendanceModel.findOne({
      userId,
      date: today,
    });

    if (!attendance) {
      throw new BadRequestException('Please check in first');
    }

    if (!attendance.lunchBreak || !attendance.lunchBreak.start) {
      throw new BadRequestException('Lunch break not started');
    }

    if (attendance.lunchBreak.end) {
      throw new BadRequestException('Lunch break already ended');
    }

    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - new Date(attendance.lunchBreak.start).getTime()) / (1000 * 60),
    );

    attendance.lunchBreak.end = endTime;
    attendance.lunchBreak.duration = duration;

    await attendance.save();

    return {
      success: true,
      message: 'Lunch break ended',
      data: attendance,
    };
  }

  async getTodayAttendance(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.attendanceModel.findOne({
      userId,
      date: today,
    });

    return {
      success: true,
      data: attendance || null,
    };
  }

  async getHistory(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    page: number = 1,
    limit: number = 10,
  ) {
    const query: any = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const skip = (page - 1) * limit;

    const [attendances, total] = await Promise.all([
      this.attendanceModel
        .find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      this.attendanceModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: attendances,
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

  async getStats(userId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendances = await this.attendanceModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const stats = {
      present: attendances.filter(a => a.status === AttendanceStatus.PRESENT).length,
      absent: attendances.filter(a => a.status === AttendanceStatus.ABSENT).length,
      late: attendances.filter(a => a.status === AttendanceStatus.LATE).length,
      halfDay: attendances.filter(a => a.status === AttendanceStatus.HALF_DAY).length,
      onLeave: attendances.filter(a => a.status === AttendanceStatus.ON_LEAVE).length,
      totalWorkingHours: 0,
      totalOvertime: 0,
      totalLateMinutes: 0,
      totalLunchHours: 0,
    };

    attendances.forEach(a => {
      if (a.workingHours) {
        stats.totalWorkingHours += a.workingHours.actual || 0;
        stats.totalOvertime += a.workingHours.overtime || 0;
      }
      if (a.lateLogin) {
        stats.totalLateMinutes += a.lateLogin.minutes || 0;
      }
      if (a.lunchBreak) {
        stats.totalLunchHours += a.lunchBreak.duration || 0;
      }
    });

    stats.totalWorkingHours = parseFloat(stats.totalWorkingHours.toFixed(2));
    stats.totalOvertime = parseFloat(stats.totalOvertime.toFixed(2));

    const totalDays = new Date(year, month, 0).getDate();
    const workingDays = this.getWorkingDays(startDate, endDate);

    return {
      success: true,
      data: {
        ...stats,
        totalDays,
        workingDays,
        attendanceRate: workingDays > 0 ? Math.round((stats.present / workingDays) * 100) : 0,
      },
    };
  }

  async findAll(params: {
    page: number;
    limit: number;
    date?: Date;
    department?: string;
    status?: string;
  }) {
    const { page, limit, date, department, status } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (date) query.date = date;
    if (status) query.status = status;

    if (department) {
      const users = await this.usersService.findByDepartment(department);
      const userIds = users.data.map(u => u.id);
      query.userId = { $in: userIds };
    }

    const [attendances, total] = await Promise.all([
      this.attendanceModel
        .find(query)
        .populate('userId', 'firstName lastName email employeeId department')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      this.attendanceModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: attendances,
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

  async getDepartmentAttendance(departmentId: string, date?: Date) {
    const users = await this.usersService.findByDepartment(departmentId);
    const userIds = users.data.map(u => u.id);

    const query: any = { userId: { $in: userIds } };
    if (date) query.date = date;

    const attendances = await this.attendanceModel
      .find(query)
      .populate('userId', 'firstName lastName email employeeId')
      .sort({ date: -1 });

    return {
      success: true,
      data: attendances,
    };
  }

  async getUserAttendance(userId: string, startDate?: Date, endDate?: Date) {
    const query: any = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const attendances = await this.attendanceModel
      .find(query)
      .sort({ date: -1 });

    return {
      success: true,
      data: attendances,
    };
  }

  async correctAttendance(id: string, correctionData: any) {
    const attendance = await this.attendanceModel.findById(id);
    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    // Store correction history
    attendance.manualCorrection = {
      isCorrected: true,
      correctedBy: correctionData.correctedBy,
      reason: correctionData.reason,
      corrections: [
        {
          field: 'status',
          oldValue: attendance.status,
          newValue: correctionData.status,
          correctedAt: new Date(),
        },
      ],
      correctedAt: new Date(),
    };

    // Update fields
    if (correctionData.status) {
      attendance.status = correctionData.status;
    }

    if (correctionData.checkIn) {
      attendance.checkIn = {
        ...attendance.checkIn,
        time: new Date(correctionData.checkIn),
      };
    }

    if (correctionData.checkOut) {
      attendance.checkOut = {
        ...attendance.checkOut,
        time: new Date(correctionData.checkOut),
      };
    }

    await attendance.save();

    return {
      success: true,
      message: 'Attendance corrected successfully',
      data: attendance,
    };
  }

  async getOverallStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalRecords,
      todayRecords,
      byStatus,
      monthlyStats,
    ] = await Promise.all([
      this.attendanceModel.countDocuments(),
      this.attendanceModel.countDocuments({ date: today }),
      this.attendanceModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.attendanceModel.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(today.getFullYear(), today.getMonth(), 1),
              $lte: new Date(today.getFullYear(), today.getMonth() + 1, 0),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalHours: { $sum: '$workingHours.actual' },
            totalOvertime: { $sum: '$workingHours.overtime' },
          },
        },
      ]),
    ]);

    return {
      success: true,
      data: {
        total: totalRecords,
        today: todayRecords,
        byStatus,
        monthly: {
          totalHours: monthlyStats[0]?.totalHours || 0,
          totalOvertime: monthlyStats[0]?.totalOvertime || 0,
        },
      },
    };
  }

  private getWorkingDays(startDate: Date, endDate: Date): number {
    let count = 0;
    const current = new Date(startDate);
    while (current <= endDate) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  }
}