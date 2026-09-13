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
exports.CreateAssessmentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shared_1 = require("@interhive/shared");
class QuestionOptionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { text: { required: true, type: () => String }, id: { required: false, type: () => String }, isCorrect: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestionOptionDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestionOptionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QuestionOptionDto.prototype, "isCorrect", void 0);
class QuestionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, type: () => Object }, difficulty: { required: false, type: () => Object }, category: { required: false, type: () => String }, text: { required: true, type: () => String }, options: { required: false, type: () => [QuestionOptionDto] }, correctAnswer: { required: false, type: () => Object }, explanation: { required: false, type: () => String }, points: { required: true, type: () => Number, minimum: 1 }, codeSnippet: { required: false, type: () => String }, expectedOutput: { required: false, type: () => String }, constraints: { required: false, type: () => [String] } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['multiple_choice', 'multiple_select', 'coding', 'essay', 'practical'] }),
    (0, class_validator_1.IsEnum)(['multiple_choice', 'multiple_select', 'coding', 'essay', 'practical']),
    __metadata("design:type", String)
], QuestionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['easy', 'medium', 'hard'], default: 'medium' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['easy', 'medium', 'hard']),
    __metadata("design:type", String)
], QuestionDto.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestionDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestionDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QuestionOptionDto),
    __metadata("design:type", Array)
], QuestionDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], QuestionDto.prototype, "correctAnswer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestionDto.prototype, "explanation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QuestionDto.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestionDto.prototype, "codeSnippet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestionDto.prototype, "expectedOutput", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], QuestionDto.prototype, "constraints", void 0);
class CreateAssessmentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: false, type: () => String }, type: { required: true, enum: require("../../../../../shared/dist/types/index").AssessmentType }, category: { required: false, type: () => [String] }, skillsAssessed: { required: false }, difficulty: { required: false, type: () => Object }, duration: { required: true, type: () => Number, minimum: 1 }, passingScore: { required: false, type: () => Number, minimum: 0, maximum: 100 }, questions: { required: true, type: () => [QuestionDto] }, maxAttempts: { required: false, type: () => Number, minimum: 1 } };
    }
}
exports.CreateAssessmentDto = CreateAssessmentDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['technical', 'soft_skills', 'aptitude', 'behavioral', 'coding', 'project'] }),
    (0, class_validator_1.IsEnum)(['technical', 'soft_skills', 'aptitude', 'behavioral', 'coding', 'project']),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateAssessmentDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], CreateAssessmentDto.prototype, "skillsAssessed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['beginner', 'intermediate', 'advanced', 'expert']),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateAssessmentDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 70 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateAssessmentDto.prototype, "passingScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QuestionDto),
    __metadata("design:type", Array)
], CreateAssessmentDto.prototype, "questions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateAssessmentDto.prototype, "maxAttempts", void 0);
