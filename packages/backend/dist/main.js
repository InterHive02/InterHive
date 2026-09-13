"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const all_exceptions_filter_1 = require("./core/filters/all-exceptions.filter");
const transform_interceptor_1 = require("./core/interceptors/transform.interceptor");
const logging_interceptor_1 = require("./core/interceptors/logging.interceptor");
const timeout_interceptor_1 = require("./core/interceptors/timeout.interceptor");
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    app.use(require('express').json({ limit: '10mb' }));
    app.use(require('express').urlencoded({ limit: '10mb', extended: true }));
    app.use(helmet_1.default({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    }));
    app.use(compression_1.default());
    app.use(cookie_parser_1.default());
    app.enableCors({
        origin: configService.get('CORS_ORIGIN', 'http://localhost:3000').split(','),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
        prefix: 'api/v',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.useGlobalInterceptors(new timeout_interceptor_1.TimeoutInterceptor());
    app.getHttpAdapter().get('/health', (req, res) => {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            environment: configService.get('NODE_ENV'),
            version: require('../package.json').version,
        });
    });
    const port = configService.get('PORT', 3000);
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
    logger.log(`📚 API Documentation: ${await app.getUrl()}/api/docs`);
    logger.log(`🌍 Environment: ${configService.get('NODE_ENV')}`);
    logger.log(`🏷️  Version: ${require('../package.json').version}`);
}
bootstrap();
