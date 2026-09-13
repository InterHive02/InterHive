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
exports.AssessmentQuestionSchema = exports.AssessmentQuestion = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AssessmentQuestion = class AssessmentQuestion {
};
exports.AssessmentQuestion = AssessmentQuestion;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'SkillAssessment',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AssessmentQuestion.prototype, "assessmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['multiple_choice', 'multiple_select', 'coding', 'essay', 'practical'],
        required: true,
    }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "difficulty", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                id: { type: String },
                text: { type: String },
                isCorrect: { type: Boolean },
            }],
    }),
    __metadata("design:type", Array)
], AssessmentQuestion.prototype, "options", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.SchemaTypes.Mixed,
    }),
    __metadata("design:type", Object)
], AssessmentQuestion.prototype, "correctAnswer", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "explanation", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        default: 10,
    }),
    __metadata("design:type", Number)
], AssessmentQuestion.prototype, "points", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "codeSnippet", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "expectedOutput", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], AssessmentQuestion.prototype, "constraints", void 0);
exports.AssessmentQuestion = AssessmentQuestion = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AssessmentQuestion);
exports.AssessmentQuestionSchema = mongoose_1.SchemaFactory.createForClass(AssessmentQuestion);
