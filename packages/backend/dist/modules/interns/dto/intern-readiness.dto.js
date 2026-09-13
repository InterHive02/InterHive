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
exports.InternReadinessDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class InternReadinessDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { overall: { required: true, type: () => Number }, breakdown: { required: true, type: () => ({ technicalSkills: { required: true, type: () => Number }, projects: { required: true, type: () => Number }, communication: { required: true, type: () => Number }, problemSolving: { required: true, type: () => Number }, industryWorkflow: { required: true, type: () => Number }, teamCollaboration: { required: true, type: () => Number }, leadership: { required: true, type: () => Number }, adaptability: { required: true, type: () => Number } }) }, lastUpdated: { required: true, type: () => Date }, history: { required: true } };
    }
}
exports.InternReadinessDto = InternReadinessDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 85 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InternReadinessDto.prototype, "overall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], InternReadinessDto.prototype, "breakdown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], InternReadinessDto.prototype, "lastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], InternReadinessDto.prototype, "history", void 0);
