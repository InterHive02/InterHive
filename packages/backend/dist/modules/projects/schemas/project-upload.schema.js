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
exports.ProjectUploadSchema = exports.ProjectUpload = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ProjectUpload = class ProjectUpload {
};
exports.ProjectUpload = ProjectUpload;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Project',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProjectUpload.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'ProjectTask',
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProjectUpload.prototype, "taskId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProjectUpload.prototype, "uploadedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], ProjectUpload.prototype, "fileName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
    }),
    __metadata("design:type", Number)
], ProjectUpload.prototype, "fileSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], ProjectUpload.prototype, "fileType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], ProjectUpload.prototype, "fileUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], ProjectUpload.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: Date.now,
    }),
    __metadata("design:type", Date)
], ProjectUpload.prototype, "uploadDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['draft', 'submitted', 'reviewed', 'approved', 'rejected'],
        default: 'draft',
    }),
    __metadata("design:type", String)
], ProjectUpload.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], ProjectUpload.prototype, "feedback", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProjectUpload.prototype, "reviewedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], ProjectUpload.prototype, "reviewedAt", void 0);
exports.ProjectUpload = ProjectUpload = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ProjectUpload);
exports.ProjectUploadSchema = mongoose_1.SchemaFactory.createForClass(ProjectUpload);
