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
exports.ProjectTaskSchema = exports.ProjectTask = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@interhive/shared");
let ProjectTask = class ProjectTask {
};
exports.ProjectTask = ProjectTask;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Project',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProjectTask.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], ProjectTask.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], ProjectTask.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.Types.ObjectId],
        ref: 'User',
    }),
    __metadata("design:type", Array)
], ProjectTask.prototype, "assignedTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['to_do', 'in_progress', 'review', 'completed', 'blocked'],
        default: 'to_do',
    }),
    __metadata("design:type", String)
], ProjectTask.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    }),
    __metadata("design:type", String)
], ProjectTask.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
    }),
    __metadata("design:type", Number)
], ProjectTask.prototype, "storyPoints", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], ProjectTask.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], ProjectTask.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.Types.ObjectId],
    }),
    __metadata("design:type", Array)
], ProjectTask.prototype, "dependencies", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                title: { type: String },
                status: { type: String, enum: ['to_do', 'in_progress', 'completed'] },
                assignedTo: { type: mongoose_2.Types.ObjectId },
            }],
    }),
    __metadata("design:type", Array)
], ProjectTask.prototype, "subtasks", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                authorId: { type: mongoose_2.Types.ObjectId, ref: 'User' },
                content: { type: String },
                attachments: [{
                        name: { type: String },
                        url: { type: String },
                        type: { type: String },
                    }],
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date },
                replies: [
                    {
                        authorId: { type: mongoose_2.Types.ObjectId, ref: 'User' },
                        content: { type: String },
                        createdAt: { type: Date, default: Date.now },
                    },
                ],
            }],
    }),
    __metadata("design:type", Array)
], ProjectTask.prototype, "comments", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                name: { type: String },
                url: { type: String },
                type: { type: String },
                size: { type: Number },
            }],
    }),
    __metadata("design:type", Array)
], ProjectTask.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ProjectTask.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                field: { type: String },
                oldValue: { type: mongoose_2.SchemaTypes.Mixed },
                newValue: { type: mongoose_2.SchemaTypes.Mixed },
                changedBy: { type: mongoose_2.Types.ObjectId, ref: 'User' },
                changedAt: { type: Date, default: Date.now },
            }],
    }),
    __metadata("design:type", Array)
], ProjectTask.prototype, "history", void 0);
exports.ProjectTask = ProjectTask = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ProjectTask);
exports.ProjectTaskSchema = mongoose_1.SchemaFactory.createForClass(ProjectTask);
