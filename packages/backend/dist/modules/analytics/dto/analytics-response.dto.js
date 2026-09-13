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
exports.CompanyAnalyticsDto = exports.ReadinessAnalyticsDto = exports.AnalyticsResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class AnalyticsResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Boolean }, message: { required: true, type: () => String }, data: { required: true, type: () => Object }, timestamp: { required: true, type: () => Date } };
    }
}
exports.AnalyticsResponseDto = AnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AnalyticsResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AnalyticsResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AnalyticsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AnalyticsResponseDto.prototype, "timestamp", void 0);
class ReadinessAnalyticsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { overallAverage: { required: true, type: () => Number }, byDepartment: { required: true }, distribution: { required: true }, topSkills: { required: true }, trends: { required: true } };
    }
}
exports.ReadinessAnalyticsDto = ReadinessAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReadinessAnalyticsDto.prototype, "overallAverage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ReadinessAnalyticsDto.prototype, "byDepartment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ReadinessAnalyticsDto.prototype, "distribution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ReadinessAnalyticsDto.prototype, "topSkills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ReadinessAnalyticsDto.prototype, "trends", void 0);
class CompanyAnalyticsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { totalCompanies: { required: true, type: () => Number }, byIndustry: { required: true }, byStatus: { required: true }, hiringTrends: { required: true }, satisfactionScore: { required: true, type: () => Number } };
    }
}
exports.CompanyAnalyticsDto = CompanyAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CompanyAnalyticsDto.prototype, "totalCompanies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], CompanyAnalyticsDto.prototype, "byIndustry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], CompanyAnalyticsDto.prototype, "byStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], CompanyAnalyticsDto.prototype, "hiringTrends", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CompanyAnalyticsDto.prototype, "satisfactionScore", void 0);
