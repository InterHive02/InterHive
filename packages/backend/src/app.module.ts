import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

// Core
import { databaseConfig, jwtConfig, redisConfig, cloudflareConfig, mailConfig } from './core/config/index';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { RolesGuard } from './core/guards/roles.guard';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { InternsModule } from './modules/interns/interns.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { TrainingModule } from './modules/training/training.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { MatchingModule } from './modules/matching/matching.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CommunicationModule } from './modules/communication/communication.module';

// Common
import { DatabaseModule } from './common/database/database.module';
import { RedisModule } from './common/redis/redis.module';
import { MailModule } from './common/mail/mail.module';
import { StorageModule } from './common/storage/storage.module';
import { QueueModule } from './common/queue/queue.module';

// Middleware
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { RateLimitMiddleware } from './core/middleware/rate-limit.middleware';
import { CorrelationIdMiddleware } from './core/middleware/correlation-id.middleware';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '.env.production'],
      load: [databaseConfig, jwtConfig, redisConfig, cloudflareConfig, mailConfig],
    }),

    // Cache
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore as any,
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        password: configService.get('redis.password'),
        ttl: configService.get('redis.ttl', 60),
      } as any),
      inject: [ConfigService],
    }),

    // Queue
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
        },
        prefix: 'interhive_queue',
      }),
      inject: [ConfigService],
    }),

    // Event Emitter
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),

    // Core Modules
    DatabaseModule,
    RedisModule,
    MailModule,
    StorageModule,
    QueueModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    InternsModule,
    CompaniesModule,
    AssessmentsModule,
    TrainingModule,
    ProjectsModule,
    AttendanceModule,
    MatchingModule,
    NotificationsModule,
    AnalyticsModule,
    CommunicationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware, LoggerMiddleware, RateLimitMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}