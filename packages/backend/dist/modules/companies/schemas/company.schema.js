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
exports.CompanySchema = exports.Company = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const shared_1 = require("@interhive/shared");
let Company = class Company {
};
exports.Company = Company;
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            name: { type: String, required: true },
            legalName: { type: String, required: true },
            registrationNumber: { type: String, required: true, unique: true },
            industry: [{ type: String, required: true }],
            size: { type: Number },
            foundedYear: { type: Number },
            website: { type: String },
            description: { type: String },
            logo: { type: String },
            coverImage: { type: String },
        },
    }),
    __metadata("design:type", Object)
], Company.prototype, "companyInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            primaryContact: {
                email: { type: String, required: true },
                phone: { type: String },
                address: {
                    street: { type: String },
                    city: { type: String },
                    state: { type: String },
                    country: { type: String },
                    zipCode: { type: String },
                },
            },
            hrContact: {
                email: { type: String },
                phone: { type: String },
            },
            technicalContact: {
                email: { type: String },
                phone: { type: String },
            },
        },
    }),
    __metadata("design:type", Object)
], Company.prototype, "contact", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['pending', 'verified', 'active', 'suspended', 'inactive'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], Company.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            plan: { type: String, enum: ['basic', 'premium', 'enterprise', 'custom'], default: 'basic' },
            tier: { type: Number, default: 1 },
            startDate: { type: Date },
            endDate: { type: Date },
            features: [{ type: String }],
            price: { type: Number },
            currency: { type: String, default: 'INR' },
            status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
            autoRenew: { type: Boolean, default: true },
        },
    }),
    __metadata("design:type", Object)
], Company.prototype, "subscription", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                userId: { type: String },
                score: { type: Number },
                feedback: { type: String },
                categories: {
                    communication: { type: Number },
                    technicalSkills: { type: Number },
                    professionalism: { type: Number },
                    punctuality: { type: Number },
                    initiative: { type: Number },
                },
                createdAt: { type: Date, default: Date.now },
            }],
    }),
    __metadata("design:type", Array)
], Company.prototype, "ratings", void 0);
exports.Company = Company = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Company);
exports.CompanySchema = mongoose_1.SchemaFactory.createForClass(Company);
