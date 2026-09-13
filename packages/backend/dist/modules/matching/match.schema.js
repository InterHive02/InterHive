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
exports.MatchSchema = exports.Match = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Match = class Match {
};
exports.Match = Match;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Match.prototype, "internId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Company',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Match.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'CompanyRequirement',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Match.prototype, "requirementId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        min: 0,
        max: 100,
    }),
    __metadata("design:type", Number)
], Match.prototype, "matchScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            skillMatch: { type: Number, min: 0, max: 100 },
            readinessMatch: { type: Number, min: 0, max: 100 },
            experienceMatch: { type: Number, min: 0, max: 100 },
            preferenceMatch: { type: Number, min: 0, max: 100 },
        },
    }),
    __metadata("design:type", Object)
], Match.prototype, "breakdown", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'interview_scheduled', 'interview_completed', 'offer_made', 'offer_accepted', 'offer_rejected', 'hired', 'expired'],
        default: 'pending',
    }),
    __metadata("design:type", Object)
], Match.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            scheduledDate: { type: Date },
            type: { type: String },
            meetingLink: { type: String },
            status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'] },
        },
    }),
    __metadata("design:type", Object)
], Match.prototype, "interview", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            amount: { type: Number },
            currency: { type: String },
            period: { type: String },
            startDate: { type: Date },
            duration: { type: Number },
            position: { type: String },
            benefits: [{ type: String }],
            status: { type: String, enum: ['pending', 'accepted', 'rejected', 'expired'] },
            sentAt: { type: Date },
        },
    }),
    __metadata("design:type", Object)
], Match.prototype, "offer", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            acceptedAt: { type: Date },
            rejectedAt: { type: Date },
            hiredAt: { type: Date },
            expiredAt: { type: Date },
        },
    }),
    __metadata("design:type", Object)
], Match.prototype, "timeline", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                user: { type: mongoose_2.Types.ObjectId, ref: 'User' },
                message: { type: String },
                createdAt: { type: Date, default: Date.now },
            }],
    }),
    __metadata("design:type", Array)
], Match.prototype, "notes", void 0);
exports.Match = Match = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Match);
exports.MatchSchema = mongoose_1.SchemaFactory.createForClass(Match);
