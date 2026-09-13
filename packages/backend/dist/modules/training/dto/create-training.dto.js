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
exports.CreateTrainingDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ModuleDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: false, type: () => String }, order: { required: false, type: () => Number }, type: { required: true, type: () => Object }, duration: { required: false, type: () => Number, minimum: 0 }, content: { required: false, type: () => ({ videoUrl: { required: false, type: () => String }, content: { required: false, type: () => String }, resources: { required: false } }) }, quiz: { required: false }, assignment: { required: false, type: () => ({ description: { required: true, type: () => String }, instructions: { required: true, type: () => [String] }, submissionType: { required: true, type: () => String }, maxScore: { required: true, type: () => Number } }) }, isRequired: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModuleDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ModuleDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['video', 'article', 'quiz', 'assignment', 'project', 'lab'] }),
    (0, class_validator_1.IsEnum)(['video', 'article', 'quiz', 'assignment', 'project', 'lab']),
    __metadata("design:type", String)
], ModuleDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ModuleDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ModuleDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], ModuleDto.prototype, "quiz", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ModuleDto.prototype, "assignment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ModuleDto.prototype, "isRequired", void 0);
class CreateTrainingDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: false, type: () => String }, category: { required: false, type: () => String }, tags: { required: false, type: () => [String] }, duration: { required: false, type: () => ({ min: { required: true, type: () => Number }, max: { required: true, type: () => Number } }) }, level: { required: false, type: () => Object }, industry: { required: false }, eligibility: { required: false, type: () => ({ requiredSkills: { required: false }, preferredSkills: { required: false }, minReadinessScore: { required: false, type: () => Number }, startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date } }) }, modules: { required: true, type: () => [ModuleDto] }, mentors: { required: false, type: () => [String] }, pricing: { required: false, type: () => ({ type: { required: true, type: () => Object } }) } };
    }
}
exports.CreateTrainingDto = CreateTrainingDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrainingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrainingDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrainingDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTrainingDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTrainingDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['beginner', 'intermediate', 'advanced', 'expert']),
    __metadata("design:type", String)
], CreateTrainingDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], CreateTrainingDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTrainingDto.prototype, "eligibility", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ModuleDto),
    __metadata("design:type", Array)
], CreateTrainingDto.prototype, "modules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTrainingDto.prototype, "mentors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['free', 'paid'], default: 'free' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['free', 'paid']),
    __metadata("design:type", Object)
], CreateTrainingDto.prototype, "pricing", void 0);
