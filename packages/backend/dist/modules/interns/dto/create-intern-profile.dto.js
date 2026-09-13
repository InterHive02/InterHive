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
exports.CreateInternProfileDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class PersonalInfoDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, dateOfBirth: { required: false, type: () => Date }, gender: { required: false, type: () => String }, nationality: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalInfoDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalInfoDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PersonalInfoDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalInfoDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalInfoDto.prototype, "nationality", void 0);
class ContactDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, phone: { required: false, type: () => String }, address: { required: false, type: () => ({ street: { required: false, type: () => String }, city: { required: false, type: () => String }, state: { required: false, type: () => String }, country: { required: false, type: () => String }, zipCode: { required: false, type: () => String } }) } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ContactDto.prototype, "address", void 0);
class AcademicInfoDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { currentEducation: { required: true, type: () => ({ institution: { required: true, type: () => String }, degree: { required: true, type: () => String }, field: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: false, type: () => Date }, isCurrent: { required: true, type: () => Boolean }, grade: { required: false, type: () => String } }) }, previousEducation: { required: false, type: () => [Object] }, cgpa: { required: false, type: () => Number, minimum: 0, maximum: 10 }, graduationYear: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], AcademicInfoDto.prototype, "currentEducation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AcademicInfoDto.prototype, "previousEducation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], AcademicInfoDto.prototype, "cgpa", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AcademicInfoDto.prototype, "graduationYear", void 0);
class ProfessionalInfoDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { experience: { required: false, type: () => [Object] }, skills: { required: false, type: () => [Object] }, certifications: { required: false, type: () => [Object] }, resume: { required: false, type: () => String }, portfolio: { required: false, type: () => String }, github: { required: false, type: () => String }, linkedin: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ProfessionalInfoDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ProfessionalInfoDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ProfessionalInfoDto.prototype, "certifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProfessionalInfoDto.prototype, "resume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProfessionalInfoDto.prototype, "portfolio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProfessionalInfoDto.prototype, "github", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProfessionalInfoDto.prototype, "linkedin", void 0);
class PreferencesDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { preferredDomains: { required: false, type: () => [String] }, preferredLocation: { required: false, type: () => [String] }, preferredWorkType: { required: false, type: () => [String] }, expectedStipend: { required: false, type: () => ({ min: { required: true, type: () => Number }, max: { required: true, type: () => Number } }) }, availability: { required: false, type: () => ({ startDate: { required: true, type: () => Date }, duration: { required: true, type: () => Number } }) } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PreferencesDto.prototype, "preferredDomains", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PreferencesDto.prototype, "preferredLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PreferencesDto.prototype, "preferredWorkType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PreferencesDto.prototype, "expectedStipend", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PreferencesDto.prototype, "availability", void 0);
class CreateInternProfileDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { personalInfo: { required: true, type: () => PersonalInfoDto }, contact: { required: true, type: () => ContactDto }, academicInfo: { required: true, type: () => AcademicInfoDto }, professionalInfo: { required: true, type: () => ProfessionalInfoDto }, preferences: { required: true, type: () => PreferencesDto } };
    }
}
exports.CreateInternProfileDto = CreateInternProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PersonalInfoDto),
    __metadata("design:type", PersonalInfoDto)
], CreateInternProfileDto.prototype, "personalInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ContactDto),
    __metadata("design:type", ContactDto)
], CreateInternProfileDto.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AcademicInfoDto),
    __metadata("design:type", AcademicInfoDto)
], CreateInternProfileDto.prototype, "academicInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ProfessionalInfoDto),
    __metadata("design:type", ProfessionalInfoDto)
], CreateInternProfileDto.prototype, "professionalInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PreferencesDto),
    __metadata("design:type", PreferencesDto)
], CreateInternProfileDto.prototype, "preferences", void 0);
