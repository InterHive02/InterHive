"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const training_controller_1 = require("./training.controller");
const training_service_1 = require("./training.service");
const training_program_schema_1 = require("./schemas/training-program.schema");
const training_module_schema_1 = require("./schemas/training-module.schema");
const training_enrollment_schema_1 = require("./schemas/training-enrollment.schema");
const users_module_1 = require("../users/users.module");
const interns_module_1 = require("../interns/interns.module");
const redis_module_1 = require("../../common/redis/redis.module");
const mail_module_1 = require("../../common/mail/mail.module");
let TrainingModule = class TrainingModule {
};
exports.TrainingModule = TrainingModule;
exports.TrainingModule = TrainingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: training_program_schema_1.TrainingProgram.name, schema: training_program_schema_1.TrainingProgramSchema },
                { name: training_module_schema_1.TrainingModule.name, schema: training_module_schema_1.TrainingModuleSchema },
                { name: training_enrollment_schema_1.TrainingEnrollment.name, schema: training_enrollment_schema_1.TrainingEnrollmentSchema },
            ]),
            users_module_1.UsersModule,
            interns_module_1.InternsModule,
            redis_module_1.RedisModule,
            mail_module_1.MailModule,
        ],
        controllers: [training_controller_1.TrainingController],
        providers: [training_service_1.TrainingService],
        exports: [training_service_1.TrainingService],
    })
], TrainingModule);
