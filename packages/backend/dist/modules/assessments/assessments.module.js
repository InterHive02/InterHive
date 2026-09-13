"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const assessments_controller_1 = require("./assessments.controller");
const assessments_service_1 = require("./assessments.service");
const skill_assessment_schema_1 = require("./schemas/skill-assessment.schema");
const assessment_question_schema_1 = require("./schemas/assessment-question.schema");
const assessment_result_schema_1 = require("./schemas/assessment-result.schema");
const users_module_1 = require("../users/users.module");
const interns_module_1 = require("../interns/interns.module");
const redis_module_1 = require("../../common/redis/redis.module");
const mail_module_1 = require("../../common/mail/mail.module");
let AssessmentsModule = class AssessmentsModule {
};
exports.AssessmentsModule = AssessmentsModule;
exports.AssessmentsModule = AssessmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: skill_assessment_schema_1.SkillAssessment.name, schema: skill_assessment_schema_1.SkillAssessmentSchema },
                { name: assessment_question_schema_1.AssessmentQuestion.name, schema: assessment_question_schema_1.AssessmentQuestionSchema },
                { name: assessment_result_schema_1.AssessmentResult.name, schema: assessment_result_schema_1.AssessmentResultSchema },
            ]),
            users_module_1.UsersModule,
            interns_module_1.InternsModule,
            redis_module_1.RedisModule,
            mail_module_1.MailModule,
        ],
        controllers: [assessments_controller_1.AssessmentsController],
        providers: [assessments_service_1.AssessmentsService],
        exports: [assessments_service_1.AssessmentsService],
    })
], AssessmentsModule);
