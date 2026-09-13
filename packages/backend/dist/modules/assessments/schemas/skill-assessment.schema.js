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
exports.SkillAssessmentSchema = exports.SkillAssessment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@interhive/shared");
let SkillAssessment = class SkillAssessment {
};
exports.SkillAssessment = SkillAssessment;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], SkillAssessment.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], SkillAssessment.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['technical', 'soft_skills', 'aptitude', 'behavioral', 'coding', 'project'],
        required: true,
    }),
    __metadata("design:type", String)
], SkillAssessment.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], SkillAssessment.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                id: { type: String },
                name: { type: String },
                category: { type: String },
                level: { type: String },
            }],
    }),
    __metadata("design:type", Array)
], SkillAssessment.prototype, "skillsAssessed", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate',
    }),
    __metadata("design:type", String)
], SkillAssessment.prototype, "difficulty", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
    }),
    __metadata("design:type", Number)
], SkillAssessment.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        default: 0,
    }),
    __metadata("design:type", Number)
], SkillAssessment.prototype, "totalScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        default: 70,
    }),
    __metadata("design:type", Number)
], SkillAssessment.prototype, "passingScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                type: mongoose_2.Types.ObjectId,
                ref: 'AssessmentQuestion',
            }],
    }),
    __metadata("design:type", Array)
], SkillAssessment.prototype, "questions", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['draft', 'published', 'active', 'archived'],
        default: 'draft',
    }),
    __metadata("design:type", String)
], SkillAssessment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SkillAssessment.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 1,
    }),
    __metadata("design:type", Number)
], SkillAssessment.prototype, "maxAttempts", void 0);
exports.SkillAssessment = SkillAssessment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SkillAssessment);
exports.SkillAssessmentSchema = mongoose_1.SchemaFactory.createForClass(SkillAssessment);
