import { Injectable, NestMiddleware, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../common/redis/redis.service';

interface MemoryRateRecord {
  count: number;
  resetAt: number;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly logger = new Logger('RateLimitMiddleware');
  private static memoryStore = new Map<string, MemoryRateRecord>();
  private static cleanupTimer: NodeJS.Timeout | null = null;

  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    if (!RateLimitMiddleware.cleanupTimer) {
      // Periodically clean up expired in-memory entries every 2 minutes
      RateLimitMiddleware.cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [key, record] of RateLimitMiddleware.memoryStore.entries()) {
          if (record.resetAt <= now) {
            RateLimitMiddleware.memoryStore.delete(key);
          }
        }
      }, 120000);
      RateLimitMiddleware.cleanupTimer.unref?.();
    }
  }

  async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    // Use trusted Express IP resolution to prevent header-spoofing bypasses
    const ip = request.ip || request.socket?.remoteAddress || 'unknown-client';

    const normalizedPath = request.originalUrl || request.path || request.url;
    const limit = this.getLimitForRoute(normalizedPath);
    const windowSec = this.getWindowForRoute(normalizedPath);
    const key = `rate_limit:${ip}:${this.getRouteGroup(normalizedPath)}`;

    let current = 0;
    let ttl = windowSec;

    let redisSucceeded = false;
    try {
      const redisVal = await this.redisService.get(key);
      if (redisVal) {
        current = parseInt(redisVal, 10);
      }
      if (current >= limit) {
        response.setHeader('Retry-After', windowSec.toString());
        response.setHeader('X-RateLimit-Limit', limit.toString());
        response.setHeader('X-RateLimit-Remaining', '0');
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Too many requests. Please try again later.',
            retryAfter: windowSec,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      await this.redisService.increment(key);
      if (current === 0) {
        await this.redisService.expire(key, windowSec);
      }
      current += 1;
      redisSucceeded = true;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      // If Redis is unreachable, fail-safe to in-memory sliding window
      redisSucceeded = false;
    }

    if (!redisSucceeded) {
      const now = Date.now();
      const memRecord = RateLimitMiddleware.memoryStore.get(key);

      if (memRecord && memRecord.resetAt > now) {
        if (memRecord.count >= limit) {
          const retrySeconds = Math.max(1, Math.ceil((memRecord.resetAt - now) / 1000));
          response.setHeader('Retry-After', retrySeconds.toString());
          response.setHeader('X-RateLimit-Limit', limit.toString());
          response.setHeader('X-RateLimit-Remaining', '0');
          throw new HttpException(
            {
              statusCode: HttpStatus.TOO_MANY_REQUESTS,
              message: 'Too many requests. Please try again later.',
              retryAfter: retrySeconds,
            },
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        memRecord.count += 1;
        current = memRecord.count;
      } else {
        RateLimitMiddleware.memoryStore.set(key, {
          count: 1,
          resetAt: now + windowSec * 1000,
        });
        current = 1;
      }
    }

    const remaining = Math.max(0, limit - current);
    response.setHeader('X-RateLimit-Limit', limit.toString());
    response.setHeader('X-RateLimit-Remaining', remaining.toString());

    next();
  }

  private getRouteGroup(path: string): string {
    if (path.includes('/auth/send-otp') || path.includes('/auth/verify-otp')) return 'otp';
    if (path.includes('/auth/login') || path.includes('/auth/google')) return 'login';
    if (path.includes('/auth/register')) return 'register';
    if (path.includes('/upload')) return 'upload';
    if (path.includes('/search')) return 'search';
    return 'api';
  }

  private getLimitForRoute(path: string): number {
    if (path.includes('/auth/send-otp')) return 5;
    if (path.includes('/auth/verify-otp')) return 10;
    if (path.includes('/auth/login')) return 10;
    if (path.includes('/auth/google')) return 15;
    if (path.includes('/auth/register')) return 5;
    if (path.includes('/upload')) return 20;
    if (path.includes('/search')) return 60;
    return 100;
  }

  private getWindowForRoute(path: string): number {
    if (path.includes('/auth/send-otp')) return 60;
    if (path.includes('/auth/verify-otp')) return 60;
    if (path.includes('/auth/login')) return 60;
    if (path.includes('/auth/google')) return 60;
    if (path.includes('/auth/register')) return 60;
    if (path.includes('/upload')) return 60;
    return 60;
  }
}