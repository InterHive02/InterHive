"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const interns_controller_1 = require("./interns.controller");
const interns_service_1 = require("./interns.service");
const intern_profile_schema_1 = require("./schemas/intern-profile.schema");
const intern_application_schema_1 = require("./schemas/intern-application.schema");
const intern_readiness_schema_1 = require("./schemas/intern-readiness.schema");
const users_module_1 = require("../users/users.module");
const redis_module_1 = require("../../common/redis/redis.module");
const mail_module_1 = require("../../common/mail/mail.module");
let InternsModule = class InternsModule {
};
exports.InternsModule = InternsModule;
exports.InternsModule = InternsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: intern_profile_schema_1.InternProfile.name, schema: intern_profile_schema_1.InternProfileSchema },
                { name: intern_application_schema_1.InternApplication.name, schema: intern_application_schema_1.InternApplicationSchema },
                { name: intern_readiness_schema_1.InternReadiness.name, schema: intern_readiness_schema_1.InternReadinessSchema },
            ]),
            users_module_1.UsersModule,
            redis_module_1.RedisModule,
            mail_module_1.MailModule,
        ],
        controllers: [interns_controller_1.InternsController],
        providers: [interns_service_1.InternsService],
        exports: [interns_service_1.InternsService, mongoose_1.MongooseModule],
    })
], InternsModule);
