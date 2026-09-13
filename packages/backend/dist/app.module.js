"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_manager_1 = require("@nestjs/cache-manager");
const redisStore = __importStar(require("cache-manager-redis-store"));
const index_1 = require("./core/config/index");
const jwt_auth_guard_1 = require("./core/guards/jwt-auth.guard");
const roles_guard_1 = require("./core/guards/roles.guard");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const interns_module_1 = require("./modules/interns/interns.module");
const companies_module_1 = require("./modules/companies/companies.module");
const assessments_module_1 = require("./modules/assessments/assessments.module");
const training_module_1 = require("./modules/training/training.module");
const projects_module_1 = require("./modules/projects/projects.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const matching_module_1 = require("./modules/matching/matching.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const communication_module_1 = require("./modules/communication/communication.module");
const applications_module_1 = require("./modules/applications/applications.module");
const database_module_1 = require("./common/database/database.module");
const redis_module_1 = require("./common/redis/redis.module");
const mail_module_1 = require("./common/mail/mail.module");
const storage_module_1 = require("./common/storage/storage.module");
const queue_module_1 = require("./common/queue/queue.module");
const logger_middleware_1 = require("./core/middleware/logger.middleware");
const rate_limit_middleware_1 = require("./core/middleware/rate-limit.middleware");
const correlation_id_middleware_1 = require("./core/middleware/correlation-id.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(correlation_id_middleware_1.CorrelationIdMiddleware, logger_middleware_1.LoggerMiddleware, rate_limit_middleware_1.RateLimitMiddleware)
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.local', '.env.production'],
                load: [index_1.databaseConfig, index_1.jwtConfig, index_1.redisConfig, index_1.cloudflareConfig, index_1.mailConfig],
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                useFactory: (configService) => ({
                    store: redisStore,
                    host: configService.get('redis.host'),
                    port: configService.get('redis.port'),
                    password: configService.get('redis.password'),
                    ttl: configService.get('redis.ttl', 60),
                }),
                inject: [config_1.ConfigService],
            }),
            bull_1.BullModule.forRootAsync({
                useFactory: (configService) => ({
                    redis: {
                        host: configService.get('redis.host'),
                        port: configService.get('redis.port'),
                        password: configService.get('redis.password'),
                    },
                    prefix: 'interhive_queue',
                }),
                inject: [config_1.ConfigService],
            }),
            event_emitter_1.EventEmitterModule.forRoot({
                wildcard: false,
                delimiter: '.',
                newListener: false,
                removeListener: false,
                maxListeners: 10,
                verboseMemoryLeak: false,
                ignoreErrors: false,
            }),
            database_module_1.DatabaseModule,
            redis_module_1.RedisModule,
            mail_module_1.MailModule,
            storage_module_1.StorageModule,
            queue_module_1.QueueModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            interns_module_1.InternsModule,
            companies_module_1.CompaniesModule,
            assessments_module_1.AssessmentsModule,
            training_module_1.TrainingModule,
            projects_module_1.ProjectsModule,
            attendance_module_1.AttendanceModule,
            matching_module_1.MatchingModule,
            notifications_module_1.NotificationsModule,
            analytics_module_1.AnalyticsModule,
            communication_module_1.CommunicationModule,
            applications_module_1.ApplicationsModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
