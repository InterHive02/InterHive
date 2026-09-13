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
exports.InternProfileSchema = exports.InternProfile = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@interhive/shared");
let InternProfile = class InternProfile {
};
exports.InternProfile = InternProfile;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InternProfile.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            dateOfBirth: { type: Date },
            gender: { type: String },
            nationality: { type: String },
            profilePhoto: { type: String },
        },
    }),
    __metadata("design:type", Object)
], InternProfile.prototype, "personalInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            email: { type: String, required: true },
            phone: { type: String },
            alternatePhone: { type: String },
            address: {
                street: { type: String },
                city: { type: String },
                state: { type: String },
                country: { type: String },
                zipCode: { type: String },
            },
            socialMedia: {
                linkedin: { type: String },
                github: { type: String },
                twitter: { type: String },
                portfolio: { type: String },
            },
        },
    }),
    __metadata("design:type", Object)
], InternProfile.prototype, "contact", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            currentEducation: {
                institution: { type: String },
                degree: { type: String },
                field: { type: String },
                startDate: { type: Date },
                endDate: { type: Date },
                isCurrent: { type: Boolean },
                grade: { type: String },
            },
            previousEducation: [{
                    institution: { type: String },
                    degree: { type: String },
                    field: { type: String },
                    startDate: { type: Date },
                    endDate: { type: Date },
                    grade: { type: String },
                }],
            cgpa: { type: Number },
            graduationYear: { type: Number },
        },
    }),
    __metadata("design:type", Object)
], InternProfile.prototype, "academicInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            experience: [{
                    company: { type: String },
                    position: { type: String },
                    startDate: { type: Date },
                    endDate: { type: Date },
                    current: { type: Boolean },
                    description: { type: String },
                    skills: [{ type: String }],
                    achievements: [{ type: String }],
                }],
            skills: [{
                    id: { type: String },
                    name: { type: String },
                    category: { type: String },
                    level: { type: String },
                    yearsOfExperience: { type: Number },
                    isVerified: { type: Boolean },
                }],
            certifications: [{
                    id: { type: String },
                    name: { type: String },
                    issuer: { type: String },
                    issuedDate: { type: Date },
                    expiryDate: { type: Date },
                    credentialId: { type: String },
                    credentialUrl: { type: String },
                    isVerified: { type: Boolean },
                }],
            resume: { type: String },
            portfolio: { type: String },
            github: { type: String },
            linkedin: { type: String },
        },
    }),
    __metadata("design:type", Object)
], InternProfile.prototype, "professionalInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            preferredDomains: [{ type: String }],
            preferredLocation: [{ type: String }],
            preferredWorkType: [{ type: String }],
            expectedStipend: {
                min: { type: Number },
                max: { type: Number },
            },
            availability: {
                startDate: { type: Date },
                duration: { type: Number },
            },
        },
    }),
    __metadata("design:type", Object)
], InternProfile.prototype, "preferences", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['registered', 'assessed', 'training', 'project', 'ready', 'placed', 'completed', 'dropped'],
        default: 'registered',
    }),
    __metadata("design:type", String)
], InternProfile.prototype, "status", void 0);
exports.InternProfile = InternProfile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], InternProfile);
exports.InternProfileSchema = mongoose_1.SchemaFactory.createForClass(InternProfile);
