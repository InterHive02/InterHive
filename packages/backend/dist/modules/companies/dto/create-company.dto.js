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
exports.CreateCompanyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CompanyInfoDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, legalName: { required: true, type: () => String }, registrationNumber: { required: true, type: () => String }, industry: { required: true, type: () => [String] }, size: { required: false, type: () => Number }, foundedYear: { required: false, type: () => Number }, website: { required: false, type: () => String }, description: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tech Corp' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyInfoDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tech Corporation Pvt Ltd' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyInfoDto.prototype, "legalName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TC123456' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyInfoDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Technology', 'Software'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CompanyInfoDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CompanyInfoDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CompanyInfoDto.prototype, "foundedYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CompanyInfoDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyInfoDto.prototype, "description", void 0);
class ContactInfoDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, phone: { required: false, type: () => String }, address: { required: false, type: () => ({ street: { required: false, type: () => String }, city: { required: false, type: () => String }, state: { required: false, type: () => String }, country: { required: false, type: () => String }, zipCode: { required: false, type: () => String } }) } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'hr@techcorp.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ContactInfoDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactInfoDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ContactInfoDto.prototype, "address", void 0);
class SubscriptionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { plan: { required: false, type: () => String }, tier: { required: false, type: () => Number }, startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 'basic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubscriptionDto.prototype, "tier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], SubscriptionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], SubscriptionDto.prototype, "endDate", void 0);
class CreateCompanyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { companyInfo: { required: true, type: () => CompanyInfoDto }, contact: { required: true, type: () => ({ primaryContact: { required: true, type: () => ContactInfoDto }, hrContact: { required: false, type: () => ContactInfoDto }, technicalContact: { required: false, type: () => ContactInfoDto } }) }, subscription: { required: false, type: () => SubscriptionDto } };
    }
}
exports.CreateCompanyDto = CreateCompanyDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CompanyInfoDto),
    __metadata("design:type", CompanyInfoDto)
], CreateCompanyDto.prototype, "companyInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ContactInfoDto),
    __metadata("design:type", Object)
], CreateCompanyDto.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SubscriptionDto),
    __metadata("design:type", SubscriptionDto)
], CreateCompanyDto.prototype, "subscription", void 0);
