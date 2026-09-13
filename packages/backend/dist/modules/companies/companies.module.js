"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const companies_controller_1 = require("./companies.controller");
const companies_service_1 = require("./companies.service");
const company_schema_1 = require("./schemas/company.schema");
const company_requirement_schema_1 = require("./schemas/company-requirement.schema");
const users_module_1 = require("../users/users.module");
const redis_module_1 = require("../../common/redis/redis.module");
const mail_module_1 = require("../../common/mail/mail.module");
let CompaniesModule = class CompaniesModule {
};
exports.CompaniesModule = CompaniesModule;
exports.CompaniesModule = CompaniesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: company_schema_1.Company.name, schema: company_schema_1.CompanySchema },
                { name: company_requirement_schema_1.CompanyRequirement.name, schema: company_requirement_schema_1.CompanyRequirementSchema },
            ]),
            users_module_1.UsersModule,
            redis_module_1.RedisModule,
            mail_module_1.MailModule,
        ],
        controllers: [companies_controller_1.CompaniesController],
        providers: [companies_service_1.CompaniesService],
        exports: [companies_service_1.CompaniesService, mongoose_1.MongooseModule],
    })
], CompaniesModule);
