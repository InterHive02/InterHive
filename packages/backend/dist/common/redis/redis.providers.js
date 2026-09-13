"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisProviders = void 0;
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
exports.redisProviders = [
    {
        provide: 'REDIS_CLIENT',
        useFactory: (configService) => {
            const host = configService.get('redis.host', 'localhost');
            const port = configService.get('redis.port', 6379);
            const password = configService.get('redis.password');
            const db = configService.get('redis.db', 0);
            const redis = new ioredis_1.default({
                host,
                port,
                password: password || undefined,
                db,
                retryStrategy: (times) => {
                    if (times > 3) {
                        return null;
                    }
                    return 2000;
                },
                maxRetriesPerRequest: 1,
                enableReadyCheck: false,
                lazyConnect: true,
            });
            return redis;
        },
        inject: [config_1.ConfigService],
    },
];
