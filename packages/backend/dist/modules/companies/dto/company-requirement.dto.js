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
exports.CreateCompanyRequirementDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateCompanyRequirementDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { position: { required: true, type: () => String }, department: { required: false, type: () => String }, count: { required: true, type: () => Number, minimum: 1 }, skills: { required: true }, experience: { required: false, type: () => ({ min: { required: true, type: () => Number }, max: { required: false, type: () => Number } }) }, education: { required: false, type: () => ({ minDegree: { required: true, type: () => String }, preferredFields: { required: true, type: () => [String] } }) }, responsibilities: { required: false, type: () => [String] }, benefits: { required: false, type: () => [String] }, stipend: { required: true, type: () => ({ min: { required: true, type: () => Number }, max: { required: true, type: () => Number }, currency: { required: true, type: () => String }, period: { required: true, type: () => Object } }) }, workType: { required: true, type: () => Object }, location: { required: false, type: () => String }, duration: { required: true, type: () => ({ min: { required: true, type: () => Number }, max: { required: true, type: () => Number } }) }, startDate: { required: true, type: () => Date }, applicationDeadline: { required: false, type: () => Date } };
    }
}
exports.CreateCompanyRequirementDto = CreateCompanyRequirementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Frontend Developer' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyRequirementDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyRequirementDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateCompanyRequirementDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], CreateCompanyRequirementDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCompanyRequirementDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCompanyRequirementDto.prototype, "education", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCompanyRequirementDto.prototype, "responsibilities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCompanyRequirementDto.prototype, "benefits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCompanyRequirementDto.prototype, "stipend", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['remote', 'hybrid', 'onsite'], default: 'hybrid' }),
    (0, class_validator_1.IsEnum)(['remote', 'hybrid', 'onsite']),
    __metadata("design:type", String)
], CreateCompanyRequirementDto.prototype, "workType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyRequirementDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCompanyRequirementDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateCompanyRequirementDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateCompanyRequirementDto.prototype, "applicationDeadline", void 0);
