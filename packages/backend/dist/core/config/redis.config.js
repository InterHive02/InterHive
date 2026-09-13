"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('redis', () => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0', 10),
    ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
    prefix: process.env.REDIS_PREFIX || 'interhive:',
    retry: {
        attempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS || '10', 10),
        delay: parseInt(process.env.REDIS_RETRY_DELAY || '3000', 10),
    },
}));
