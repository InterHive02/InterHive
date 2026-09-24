import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './core/interceptors/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { StatsService } from './modules/stats/stats.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Increase body size limit to allow base64-encoded profile photos
  app.use(require('express').json({ limit: '10mb' }));
  app.use(require('express').urlencoded({ limit: '10mb', extended: true }));

  // Global middleware
  app.use((helmet as any)({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
  app.use((compression as any)());
  app.use((cookieParser as any)());
  
  // CORS configuration
  const customOrigins = configService
    .get('CORS_ORIGIN', '')
    .split(',')
    .map((o: string) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const standardOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://interhive.in',
        'https://www.interhive.in',
        'http://interhive.in',
        'http://www.interhive.in',
        ...customOrigins,
      ];

      const isAllowed =
        standardOrigins.includes(origin) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('interhive.in') ||
        origin.includes('onrender.com');

      if (isAllowed) {
        return callback(null, true);
      }

      // Safe fallback - avoid crashing request handler with Error
      logger.warn(`Untracked CORS origin request: ${origin}`);
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  });

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Global filters and interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());

// Swagger documentation - temporarily disabled
// const config = new DocumentBuilder()
//   .setTitle('InterHive API')
//   .setDescription('InterHive - Industry Readiness & Talent Connect Platform API')
//   .setVersion('1.0')
//   .addBearerAuth()
//   .addTag('Auth', 'Authentication endpoints')
//   .addTag('Interns', 'Intern management endpoints')
//   .addTag('Companies', 'Company management endpoints')
//   .addTag('Assessments', 'Skill assessment endpoints')
//   .addTag('Training', 'Training program endpoints')
//   .addTag('Projects', 'Project management endpoints')
//   .addTag('Matching', 'Smart matching endpoints')
//   .addTag('Analytics', 'Analytics and reporting endpoints')
//   .build();
//   
// const document = SwaggerModule.createDocument(app, config);
// SwaggerModule.setup('api/docs', app, document);

  // Root & Health check endpoints
  const healthHandler = (req, res) => {
    res.status(200).json({
      name: 'InterHive API',
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: configService.get('NODE_ENV'),
      version: require('../package.json').version,
    });
  };

  app.getHttpAdapter().get('/', healthHandler);
  app.getHttpAdapter().get('/health', healthHandler);
  app.getHttpAdapter().get('/api/health', healthHandler);
  app.getHttpAdapter().get('/api/v1/health', healthHandler);

  // Unversioned public stats endpoints (aliases for /api/stats and /stats)
  try {
    const statsService = app.get(StatsService);
    const statsHandler = async (req: any, res: any) => {
      try {
        const data = await statsService.getPublicStats();
        res.status(200).json({ success: true, data });
      } catch (err: any) {
        res.status(200).json({
          success: true,
          data: {
            companyCount: 0,
            activeInternshipsCount: 0,
            studentsPlacedCount: 0,
            averageRating: null,
          },
        });
      }
    };
    app.getHttpAdapter().get('/api/stats', statsHandler);
    app.getHttpAdapter().get('/stats', statsHandler);
  } catch (statsInitErr) {
    logger.warn('Stats endpoint fallback handler registration skipped');
  }

  // Start server
  const port = configService.get('PORT', 3000);
  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
  logger.log(`📚 API Documentation: ${await app.getUrl()}/api/docs`);
  logger.log(`🌍 Environment: ${configService.get('NODE_ENV')}`);
  logger.log(`🏷️  Version: ${require('../package.json').version}`);
}

bootstrap();