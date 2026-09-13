import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
  ttl: number;
  prefix: string;
  retry: {
    attempts: number;
    delay: number;
  };
}

export default registerAs('redis', (): RedisConfig => ({
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