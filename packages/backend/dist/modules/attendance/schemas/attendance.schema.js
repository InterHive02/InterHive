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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceSchema = exports.Attendance = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@interhive/shared");
let Attendance = class Attendance {
};
exports.Attendance = Attendance;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Attendance.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        required: true,
        default: () => new Date().setHours(0, 0, 0, 0),
    }),
    __metadata("design:type", Date)
], Attendance.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            time: { type: Date },
            location: {
                latitude: { type: Number },
                longitude: { type: Number },
                address: { type: String },
            },
            ip: { type: String },
            deviceInfo: { type: String },
            screenshot: { type: String },
            notes: { type: String },
        },
    }),
    __metadata("design:type", Object)
], Attendance.prototype, "checkIn", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            time: { type: Date },
            location: {
                latitude: { type: Number },
                longitude: { type: Number },
                address: { type: String },
            },
            ip: { type: String },
            deviceInfo: { type: String },
            screenshot: { type: String },
            notes: { type: String },
        },
    }),
    __metadata("design:type", Object)
], Attendance.prototype, "checkOut", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            start: { type: Date },
            end: { type: Date },
            duration: { type: Number },
        },
    }),
    __metadata("design:type", Object)
], Attendance.prototype, "lunchBreak", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            scheduled: { type: Number, default: 8 },
            actual: { type: Number, default: 0 },
            overtime: { type: Number, default: 0 },
            breakTime: { type: Number, default: 0 },
            totalHours: { type: Number, default: 0 },
        },
    }),
    __metadata("design:type", Object)
], Attendance.prototype, "workingHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['present', 'absent', 'late', 'half_day', 'on_leave', 'holiday'],
        default: 'absent',
    }),
    __metadata("design:type", String)
], Attendance.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            isLate: { type: Boolean, default: false },
            minutes: { type: Number },
            reason: { type: String },
        },
    }),
    __metadata("design:type", Object)
], Attendance.prototype, "lateLogin", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            isEarly: { type: Boolean, default: false },
            minutes: { type: Number },
            reason: { type: String },
        },
    }),
    __metadata("design:type", Object)
], Attendance.prototype, "earlyLogout", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            isCorrected: { type: Boolean, default: false },
            correctedBy: { type: mongoose_2.Types.ObjectId, ref: 'User' },
            reason: { type: String },
            corrections: [{
                    field: { type: String },
                    oldValue: { type: mongoose_2.SchemaTypes.Mixed },
                    newValue: { type: mongoose_2.SchemaTypes.Mixed },
                    correctedAt: { type: Date },
                }],
            correctedAt: { type: Date },
        },
    }),
    __metadata("design:type", Object)
], Attendance.prototype, "manualCorrection", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
            approvedBy: { type: mongoose_2.Types.ObjectId, ref: 'User' },
            approvedAt: { type: Date },
            comments: { type: String },
        },
    }),
    __metadata("design:type", Object)
], Attendance.prototype, "approval", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Attendance.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                name: { type: String },
                url: { type: String },
                type: { type: String },
            }],
    }),
    __metadata("design:type", Array)
], Attendance.prototype, "attachments", void 0);
exports.Attendance = Attendance = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Attendance);
exports.AttendanceSchema = mongoose_1.SchemaFactory.createForClass(Attendance);
