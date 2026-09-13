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
exports.UpdateInternProfileDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateInternProfileDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { personalInfo: { required: false, type: () => ({ firstName: { required: false, type: () => String }, lastName: { required: false, type: () => String }, dateOfBirth: { required: false, type: () => Date }, gender: { required: false, type: () => String }, nationality: { required: false, type: () => String }, profilePhoto: { required: false, type: () => String } }) }, contact: { required: false, type: () => ({ email: { required: false, type: () => String }, phone: { required: false, type: () => String }, alternatePhone: { required: false, type: () => String }, address: { required: false, type: () => ({ street: { required: false, type: () => String }, city: { required: false, type: () => String }, state: { required: false, type: () => String }, country: { required: false, type: () => String }, zipCode: { required: false, type: () => String } }) } }) }, academicInfo: { required: false, type: () => ({ currentEducation: { required: false, type: () => ({ institution: { required: true, type: () => String }, degree: { required: true, type: () => String }, field: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: false, type: () => Date }, isCurrent: { required: true, type: () => Boolean }, grade: { required: false, type: () => String } }) }, cgpa: { required: false, type: () => Number }, graduationYear: { required: false, type: () => Number } }) }, professionalInfo: { required: false, type: () => ({ experience: { required: false, type: () => [Object] }, skills: { required: false, type: () => [Object] }, certifications: { required: false, type: () => [Object] }, resume: { required: false, type: () => String }, portfolio: { required: false, type: () => String }, github: { required: false, type: () => String }, linkedin: { required: false, type: () => String } }) }, preferences: { required: false, type: () => ({ preferredDomains: { required: false, type: () => [String] }, preferredLocation: { required: false, type: () => [String] }, preferredWorkType: { required: false, type: () => [String] }, expectedStipend: { required: false, type: () => ({ min: { required: true, type: () => Number }, max: { required: true, type: () => Number } }) }, availability: { required: false, type: () => ({ startDate: { required: true, type: () => Date }, duration: { required: true, type: () => Number } }) } }) } };
    }
}
exports.UpdateInternProfileDto = UpdateInternProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateInternProfileDto.prototype, "personalInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateInternProfileDto.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateInternProfileDto.prototype, "academicInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateInternProfileDto.prototype, "professionalInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateInternProfileDto.prototype, "preferences", void 0);
