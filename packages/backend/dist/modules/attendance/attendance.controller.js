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
exports.AttendanceController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attendance_service_1 = require("./attendance.service");
const check_in_dto_1 = require("./dto/check-in.dto");
const check_out_dto_1 = require("./dto/check-out.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const shared_1 = require("@interhive/shared");
const user_schema_1 = require("../users/schemas/user.schema");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async checkIn(user, checkInDto) {
        return this.attendanceService.checkIn(user.id, checkInDto);
    }
    async checkOut(user, checkOutDto) {
        return this.attendanceService.checkOut(user.id, checkOutDto);
    }
    async startLunch(user) {
        return this.attendanceService.startLunch(user.id);
    }
    async endLunch(user) {
        return this.attendanceService.endLunch(user.id);
    }
    async getTodayAttendance(user) {
        return this.attendanceService.getTodayAttendance(user.id);
    }
    async getHistory(user, startDate, endDate, page = 1, limit = 10) {
        return this.attendanceService.getHistory(user.id, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined, page, limit);
    }
    async getStats(user, month, year) {
        return this.attendanceService.getStats(user.id, month || new Date().getMonth() + 1, year || new Date().getFullYear());
    }
    async findAll(page = 1, limit = 10, date, department, status) {
        return this.attendanceService.findAll({
            page,
            limit,
            date: date ? new Date(date) : undefined,
            department,
            status,
        });
    }
    async getDepartmentAttendance(departmentId, date) {
        return this.attendanceService.getDepartmentAttendance(departmentId, date ? new Date(date) : undefined);
    }
    async getUserAttendance(userId, startDate, endDate) {
        return this.attendanceService.getUserAttendance(userId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async correctAttendance(id, correctionData) {
        return this.attendanceService.correctAttendance(id, correctionData);
    }
    async getOverallStats() {
        return this.attendanceService.getOverallStats();
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('check-in'),
    (0, swagger_1.ApiOperation)({ summary: 'Check in for the day' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Check in successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Already checked in' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        check_in_dto_1.CheckInDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('check-out'),
    (0, swagger_1.ApiOperation)({ summary: 'Check out for the day' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Check out successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Not checked in or already checked out' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        check_out_dto_1.CheckOutDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkOut", null);
__decorate([
    (0, common_1.Post)('lunch/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start lunch break' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lunch break started' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Already on lunch or not checked in' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "startLunch", null);
__decorate([
    (0, common_1.Post)('lunch/end'),
    (0, swagger_1.ApiOperation)({ summary: 'End lunch break' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lunch break ended' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Not on lunch break' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "endLunch", null);
__decorate([
    (0, common_1.Get)('today'),
    (0, swagger_1.ApiOperation)({ summary: 'Get today\'s attendance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getTodayAttendance", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance history retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, Number, Number]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all attendance records' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance records retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('department')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('department/:departmentId'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance by department' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance records retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('departmentId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getDepartmentAttendance", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance for a specific user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance records retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getUserAttendance", null);
__decorate([
    (0, common_1.Put)(':id/correct'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Correct attendance record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance corrected successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attendance record not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "correctAttendance", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overall attendance statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getOverallStats", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('Attendance'),
    (0, common_1.Controller)('attendance'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
