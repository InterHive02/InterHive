import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UserRole } from '@interhive/shared';
import { User } from '../users/schemas/user.schema';

@ApiTags('Attendance')
@Controller('attendance')
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Check in for the day' })
  @ApiResponse({ status: 200, description: 'Check in successful' })
  @ApiResponse({ status: 400, description: 'Already checked in' })
  async checkIn(
    @CurrentUser() user: User,
    @Body() checkInDto: CheckInDto,
  ) {
    return this.attendanceService.checkIn(user.id, checkInDto);
  }

  @Post('check-out')
  @ApiOperation({ summary: 'Check out for the day' })
  @ApiResponse({ status: 200, description: 'Check out successful' })
  @ApiResponse({ status: 400, description: 'Not checked in or already checked out' })
  async checkOut(
    @CurrentUser() user: User,
    @Body() checkOutDto: CheckOutDto,
  ) {
    return this.attendanceService.checkOut(user.id, checkOutDto);
  }

  @Post('lunch/start')
  @ApiOperation({ summary: 'Start lunch break' })
  @ApiResponse({ status: 200, description: 'Lunch break started' })
  @ApiResponse({ status: 400, description: 'Already on lunch or not checked in' })
  async startLunch(@CurrentUser() user: User) {
    return this.attendanceService.startLunch(user.id);
  }

  @Post('lunch/end')
  @ApiOperation({ summary: 'End lunch break' })
  @ApiResponse({ status: 200, description: 'Lunch break ended' })
  @ApiResponse({ status: 400, description: 'Not on lunch break' })
  async endLunch(@CurrentUser() user: User) {
    return this.attendanceService.endLunch(user.id);
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today\'s attendance' })
  @ApiResponse({ status: 200, description: 'Attendance retrieved successfully' })
  async getTodayAttendance(@CurrentUser() user: User) {
    return this.attendanceService.getTodayAttendance(user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get attendance history' })
  @ApiResponse({ status: 200, description: 'Attendance history retrieved successfully' })
  async getHistory(
    @CurrentUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.attendanceService.getHistory(
      user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      page,
      limit,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get attendance statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(
    @CurrentUser() user: User,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.attendanceService.getStats(
      user.id,
      month || new Date().getMonth() + 1,
      year || new Date().getFullYear(),
    );
  }

  // Manager/Admin endpoints
  @Get('all')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiResponse({ status: 200, description: 'Attendance records retrieved successfully' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('date') date?: string,
    @Query('department') department?: string,
    @Query('status') status?: string,
  ) {
    return this.attendanceService.findAll({
      page,
      limit,
      date: date ? new Date(date) : undefined,
      department,
      status,
    });
  }

  @Get('department/:departmentId')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get attendance by department' })
  @ApiResponse({ status: 200, description: 'Attendance records retrieved successfully' })
  async getDepartmentAttendance(
    @Param('departmentId') departmentId: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.getDepartmentAttendance(
      departmentId,
      date ? new Date(date) : undefined,
    );
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get attendance for a specific user' })
  @ApiResponse({ status: 200, description: 'Attendance records retrieved successfully' })
  async getUserAttendance(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getUserAttendance(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Put(':id/correct')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Correct attendance record' })
  @ApiResponse({ status: 200, description: 'Attendance corrected successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  async correctAttendance(
    @Param('id') id: string,
    @Body() correctionData: any,
  ) {
    return this.attendanceService.correctAttendance(id, correctionData);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get overall attendance statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getOverallStats() {
    return this.attendanceService.getOverallStats();
  }
}