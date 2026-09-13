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
exports.CompanyRequirementSchema = exports.CompanyRequirement = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@interhive/shared");
let CompanyRequirement = class CompanyRequirement {
};
exports.CompanyRequirement = CompanyRequirement;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Company',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CompanyRequirement.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], CompanyRequirement.prototype, "position", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], CompanyRequirement.prototype, "department", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        min: 1,
    }),
    __metadata("design:type", Number)
], CompanyRequirement.prototype, "count", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                id: { type: String },
                name: { type: String },
                category: { type: String },
                level: { type: String },
            }],
    }),
    __metadata("design:type", Array)
], CompanyRequirement.prototype, "skills", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            min: { type: Number, default: 0 },
            max: { type: Number },
        },
    }),
    __metadata("design:type", Object)
], CompanyRequirement.prototype, "experience", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            minDegree: { type: String },
            preferredFields: [{ type: String }],
        },
    }),
    __metadata("design:type", Object)
], CompanyRequirement.prototype, "education", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], CompanyRequirement.prototype, "responsibilities", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], CompanyRequirement.prototype, "benefits", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            min: { type: Number },
            max: { type: Number },
            currency: { type: String, default: 'INR' },
            period: { type: String, enum: ['monthly', 'hourly', 'stipend'], default: 'monthly' },
        },
    }),
    __metadata("design:type", Object)
], CompanyRequirement.prototype, "stipend", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['remote', 'hybrid', 'onsite'],
        default: 'hybrid',
    }),
    __metadata("design:type", String)
], CompanyRequirement.prototype, "workType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], CompanyRequirement.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            min: { type: Number, default: 1 },
            max: { type: Number },
        },
    }),
    __metadata("design:type", Object)
], CompanyRequirement.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        required: true,
    }),
    __metadata("design:type", Date)
], CompanyRequirement.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], CompanyRequirement.prototype, "applicationDeadline", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['draft', 'published', 'closed', 'filled', 'cancelled'],
        default: 'draft',
    }),
    __metadata("design:type", String)
], CompanyRequirement.prototype, "status", void 0);
exports.CompanyRequirement = CompanyRequirement = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CompanyRequirement);
exports.CompanyRequirementSchema = mongoose_1.SchemaFactory.createForClass(CompanyRequirement);
