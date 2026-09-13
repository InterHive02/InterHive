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
exports.MatchResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@interhive/shared");
class MatchResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, internId: { required: true, type: () => String }, companyId: { required: true, type: () => String }, requirementId: { required: true, type: () => String }, matchScore: { required: true, type: () => Number }, breakdown: { required: true, type: () => ({ skillMatch: { required: true, type: () => Number }, readinessMatch: { required: true, type: () => Number }, experienceMatch: { required: true, type: () => Number }, preferenceMatch: { required: true, type: () => Number } }) }, status: { required: true, enum: require("../../../../../shared/dist/constants/index").MatchStatus }, interview: { required: false, type: () => ({ scheduledDate: { required: true, type: () => Date }, type: { required: true, type: () => String }, meetingLink: { required: true, type: () => String }, status: { required: true, type: () => Object } }) }, offer: { required: false, type: () => ({ amount: { required: true, type: () => Number }, currency: { required: true, type: () => String }, period: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, duration: { required: true, type: () => Number }, position: { required: true, type: () => String }, benefits: { required: true, type: () => [String] }, status: { required: true, type: () => Object } }) }, timeline: { required: false, type: () => ({ acceptedAt: { required: false, type: () => Date }, rejectedAt: { required: false, type: () => Date }, hiredAt: { required: false, type: () => Date }, expiredAt: { required: false, type: () => Date } }) }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.MatchResponseDto = MatchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "internId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "requirementId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MatchResponseDto.prototype, "matchScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], MatchResponseDto.prototype, "breakdown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], MatchResponseDto.prototype, "interview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], MatchResponseDto.prototype, "offer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], MatchResponseDto.prototype, "timeline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MatchResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MatchResponseDto.prototype, "updatedAt", void 0);
