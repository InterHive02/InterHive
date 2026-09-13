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
exports.AssessmentResultSchema = exports.AssessmentResult = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AssessmentResult = class AssessmentResult {
};
exports.AssessmentResult = AssessmentResult;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AssessmentResult.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'SkillAssessment',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AssessmentResult.prototype, "assessmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        required: true,
        default: Date.now,
    }),
    __metadata("design:type", Date)
], AssessmentResult.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], AssessmentResult.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], AssessmentResult.prototype, "timeSpent", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                questionId: { type: mongoose_2.Types.ObjectId, ref: 'AssessmentQuestion' },
                answer: { type: mongoose_2.SchemaTypes.Mixed },
                isCorrect: { type: Boolean },
                score: { type: Number },
            }],
    }),
    __metadata("design:type", Array)
], AssessmentResult.prototype, "answers", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], AssessmentResult.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], AssessmentResult.prototype, "percentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['A', 'B', 'C', 'D', 'F'],
    }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "grade", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], AssessmentResult.prototype, "passed", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['in_progress', 'submitted', 'completed', 'evaluated', 'expired'],
        default: 'in_progress',
    }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            overall: { type: String },
            strengths: [{ type: String }],
            weaknesses: [{ type: String }],
            recommendations: [{ type: String }],
            detailedFeedback: [{
                    questionId: { type: mongoose_2.Types.ObjectId },
                    feedback: { type: String },
                    suggestions: [{ type: String }],
                }],
        },
    }),
    __metadata("design:type", Object)
], AssessmentResult.prototype, "feedback", void 0);
exports.AssessmentResult = AssessmentResult = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AssessmentResult);
exports.AssessmentResultSchema = mongoose_1.SchemaFactory.createForClass(AssessmentResult);
