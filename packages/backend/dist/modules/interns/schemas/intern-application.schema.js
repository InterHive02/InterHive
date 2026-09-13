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
exports.InternApplicationSchema = exports.InternApplication = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@interhive/shared");
let InternApplication = class InternApplication {
};
exports.InternApplication = InternApplication;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InternApplication.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Program',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InternApplication.prototype, "programId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], InternApplication.prototype, "coverLetter", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['pending', 'under_review', 'assessment', 'interview', 'offered', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], InternApplication.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
    }),
    __metadata("design:type", Number)
], InternApplication.prototype, "assessmentScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], InternApplication.prototype, "interviewDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            companyId: { type: mongoose_2.Types.ObjectId },
            position: { type: String },
            stipend: {
                amount: { type: Number },
                currency: { type: String },
                period: { type: String },
            },
            startDate: { type: Date },
            duration: { type: Number },
            location: { type: String },
            workType: { type: String },
        },
    }),
    __metadata("design:type", Object)
], InternApplication.prototype, "offerDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                user: { type: mongoose_2.Types.ObjectId, ref: 'User' },
                text: { type: String },
                createdAt: { type: Date, default: Date.now },
            }],
    }),
    __metadata("design:type", Array)
], InternApplication.prototype, "comments", void 0);
exports.InternApplication = InternApplication = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], InternApplication);
exports.InternApplicationSchema = mongoose_1.SchemaFactory.createForClass(InternApplication);
