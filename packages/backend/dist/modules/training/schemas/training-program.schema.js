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
exports.TrainingProgramSchema = exports.TrainingProgram = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TrainingProgram = class TrainingProgram {
};
exports.TrainingProgram = TrainingProgram;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], TrainingProgram.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], TrainingProgram.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], TrainingProgram.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], TrainingProgram.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            min: { type: Number },
            max: { type: Number },
        },
    }),
    __metadata("design:type", Object)
], TrainingProgram.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate',
    }),
    __metadata("design:type", String)
], TrainingProgram.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                id: { type: String },
                name: { type: String },
                category: { type: String },
            }],
    }),
    __metadata("design:type", Array)
], TrainingProgram.prototype, "industry", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            requiredSkills: [{
                    id: { type: String },
                    name: { type: String },
                    category: { type: String },
                }],
            preferredSkills: [{
                    id: { type: String },
                    name: { type: String },
                    category: { type: String },
                }],
            minReadinessScore: { type: Number, default: 40 },
            startDate: { type: Date },
            endDate: { type: Date },
        },
    }),
    __metadata("design:type", Object)
], TrainingProgram.prototype, "eligibility", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                type: mongoose_2.Types.ObjectId,
                ref: 'TrainingModule',
            }],
    }),
    __metadata("design:type", Array)
], TrainingProgram.prototype, "modules", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], TrainingProgram.prototype, "totalModules", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    }),
    __metadata("design:type", String)
], TrainingProgram.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TrainingProgram.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                type: mongoose_2.Types.ObjectId,
                ref: 'User',
            }],
    }),
    __metadata("design:type", Array)
], TrainingProgram.prototype, "mentors", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            type: String,
            default: 'free',
        },
    }),
    __metadata("design:type", Object)
], TrainingProgram.prototype, "pricing", void 0);
exports.TrainingProgram = TrainingProgram = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TrainingProgram);
exports.TrainingProgramSchema = mongoose_1.SchemaFactory.createForClass(TrainingProgram);
