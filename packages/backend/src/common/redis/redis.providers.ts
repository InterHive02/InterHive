import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisProviders: Provider[] = [
  {
    provide: 'REDIS_CLIENT',
    useFactory: (configService: ConfigService) => {
      const host = configService.get('redis.host', 'localhost');
      const port = configService.get('redis.port', 6379);
      const password = configService.get('redis.password');
      const db = configService.get('redis.db', 0);

      const redis = new Redis({
        host,
        port,
        password: password || undefined,
        db,
        retryStrategy: (times) => {
          if (times > 3) {
            return null; // Stop reconnecting if Redis is unavailable
          }
          return 2000;
        },
        maxRetriesPerRequest: 1,
        enableReadyCheck: false,
        lazyConnect: true,
      });

      return redis;
    },
    inject: [ConfigService],
  },
];