"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const matching_controller_1 = require("./matching.controller");
const matching_service_1 = require("./matching.service");
const match_schema_1 = require("./schemas/match.schema");
const skill_matcher_1 = require("./algorithms/skill-matcher");
const readiness_scorer_1 = require("./algorithms/readiness-scorer");
const users_module_1 = require("../users/users.module");
const interns_module_1 = require("../interns/interns.module");
const companies_module_1 = require("../companies/companies.module");
const assessments_module_1 = require("../assessments/assessments.module");
const redis_module_1 = require("../../common/redis/redis.module");
const mail_module_1 = require("../../common/mail/mail.module");
let MatchingModule = class MatchingModule {
};
exports.MatchingModule = MatchingModule;
exports.MatchingModule = MatchingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: match_schema_1.Match.name, schema: match_schema_1.MatchSchema },
            ]),
            users_module_1.UsersModule,
            interns_module_1.InternsModule,
            companies_module_1.CompaniesModule,
            assessments_module_1.AssessmentsModule,
            redis_module_1.RedisModule,
            mail_module_1.MailModule,
        ],
        controllers: [matching_controller_1.MatchingController],
        providers: [matching_service_1.MatchingService, skill_matcher_1.SkillMatcher, readiness_scorer_1.ReadinessScorer],
        exports: [matching_service_1.MatchingService, mongoose_1.MongooseModule],
    })
], MatchingModule);
