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
exports.ProjectSchema = exports.Project = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@interhive/shared");
let Project = class Project {
};
exports.Project = Project;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Company',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Project.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], Project.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
    }),
    __metadata("design:type", Array)
], Project.prototype, "category", void 0);
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
], Project.prototype, "requiredSkills", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            min: { type: Number },
            max: { type: Number },
        },
    }),
    __metadata("design:type", Object)
], Project.prototype, "teamSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            weeks: { type: Number },
            startDate: { type: Date },
            endDate: { type: Date },
        },
    }),
    __metadata("design:type", Object)
], Project.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['remote', 'hybrid', 'onsite'],
        default: 'hybrid',
    }),
    __metadata("design:type", String)
], Project.prototype, "workType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                type: mongoose_2.Types.ObjectId,
                ref: 'ProjectTask',
            }],
    }),
    __metadata("design:type", Array)
], Project.prototype, "tasks", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                type: mongoose_2.Types.ObjectId,
                ref: 'User',
            }],
    }),
    __metadata("design:type", Array)
], Project.prototype, "assignedTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                type: mongoose_2.Types.ObjectId,
                ref: 'User',
            }],
    }),
    __metadata("design:type", Array)
], Project.prototype, "mentors", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['planning', 'in_progress', 'completed', 'paused', 'cancelled'],
        default: 'planning',
    }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['initiation', 'planning', 'execution', 'monitoring', 'closure'],
        default: 'initiation',
    }),
    __metadata("design:type", String)
], Project.prototype, "phase", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    }),
    __metadata("design:type", Number)
], Project.prototype, "progress", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], Project.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], Project.prototype, "completedDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                name: { type: String },
                description: { type: String },
                type: { type: String },
                format: { type: String },
                expectedBy: { type: Date },
                submittedBy: { type: mongoose_2.Types.ObjectId },
                submittedAt: { type: Date },
                reviewStatus: { type: String, enum: ['pending', 'under_review', 'approved', 'rejected'] },
                feedback: { type: String },
            }],
    }),
    __metadata("design:type", Array)
], Project.prototype, "deliverables", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                name: { type: String },
                type: { type: String },
                url: { type: String },
                description: { type: String },
                accessLevel: { type: String, enum: ['public', 'team', 'restricted'] },
            }],
    }),
    __metadata("design:type", Array)
], Project.prototype, "resources", void 0);
exports.Project = Project = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Project);
exports.ProjectSchema = mongoose_1.SchemaFactory.createForClass(Project);
