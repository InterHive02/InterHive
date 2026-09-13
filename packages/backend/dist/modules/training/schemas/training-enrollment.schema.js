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
exports.TrainingEnrollmentSchema = exports.TrainingEnrollment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TrainingEnrollment = class TrainingEnrollment {
};
exports.TrainingEnrollment = TrainingEnrollment;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TrainingEnrollment.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'TrainingProgram',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TrainingEnrollment.prototype, "programId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: Date.now,
    }),
    __metadata("design:type", Date)
], TrainingEnrollment.prototype, "enrollmentDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], TrainingEnrollment.prototype, "completionDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['active', 'completed', 'withdrawn', 'dropped'],
        default: 'active',
    }),
    __metadata("design:type", String)
], TrainingEnrollment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], TrainingEnrollment.prototype, "progress", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], TrainingEnrollment.prototype, "currentModuleIndex", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                moduleId: { type: mongoose_2.Types.ObjectId, ref: 'TrainingModule' },
                status: { type: String, enum: ['locked', 'in_progress', 'completed'], default: 'locked' },
                progress: { type: Number, default: 0 },
                score: { type: Number },
                startedAt: { type: Date },
                completedAt: { type: Date },
            }],
    }),
    __metadata("design:type", Array)
], TrainingEnrollment.prototype, "moduleProgress", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            issued: { type: Boolean, default: false },
            issuedDate: { type: Date },
            certificateId: { type: String },
            verificationUrl: { type: String },
        },
    }),
    __metadata("design:type", Object)
], TrainingEnrollment.prototype, "certification", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                date: { type: Date, default: Date.now },
                type: { type: String },
                message: { type: String },
            }],
    }),
    __metadata("design:type", Array)
], TrainingEnrollment.prototype, "activityLog", void 0);
exports.TrainingEnrollment = TrainingEnrollment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TrainingEnrollment);
exports.TrainingEnrollmentSchema = mongoose_1.SchemaFactory.createForClass(TrainingEnrollment);
