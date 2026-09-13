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
exports.TrainingModuleSchema = exports.TrainingModule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TrainingModule = class TrainingModule {
};
exports.TrainingModule = TrainingModule;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'TrainingProgram',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TrainingModule.prototype, "programId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], TrainingModule.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], TrainingModule.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
    }),
    __metadata("design:type", Number)
], TrainingModule.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['video', 'article', 'quiz', 'assignment', 'project', 'lab'],
        default: 'video',
    }),
    __metadata("design:type", String)
], TrainingModule.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], TrainingModule.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            videoUrl: { type: String },
            content: { type: String },
            resources: [{
                    title: { type: String },
                    url: { type: String },
                    type: { type: String },
                }],
        },
    }),
    __metadata("design:type", Object)
], TrainingModule.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                type: {
                    type: { type: String },
                    question: { type: String },
                    options: [{ type: String }],
                    correctAnswer: { type: String },
                    explanation: { type: String },
                },
            }],
    }),
    __metadata("design:type", Array)
], TrainingModule.prototype, "quiz", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            description: { type: String },
            instructions: [{ type: String }],
            submissionType: { type: String },
            maxScore: { type: Number, default: 100 },
        },
    }),
    __metadata("design:type", Object)
], TrainingModule.prototype, "assignment", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], TrainingModule.prototype, "isRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.Types.ObjectId],
    }),
    __metadata("design:type", Array)
], TrainingModule.prototype, "prerequisites", void 0);
exports.TrainingModule = TrainingModule = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TrainingModule);
exports.TrainingModuleSchema = mongoose_1.SchemaFactory.createForClass(TrainingModule);
