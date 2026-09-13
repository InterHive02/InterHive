import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    // Rate limiting temporarily disabled for testing
    // const ip = request.ip || request.connection.remoteAddress;
    // const key = `rate_limit:${ip}`;

    // try {
    //   const current = await this.redisService.get(key);
    //   const limit = this.getLimitForRoute(request.path);

    //   if (current && parseInt(current, 10) >= limit) {
    //     throw new HttpException(
    //       'Too many requests. Please try again later.',
    //       HttpStatus.TOO_MANY_REQUESTS
    //     );
    //   }

    //   await this.redisService.increment(key);
    //   await this.redisService.expire(key, this.getWindowForRoute(request.path));

    //   next();
    // } catch (error) {
    //   if (error instanceof HttpException) {
    //     throw error;
    //   }
    //   // If Redis fails, allow the request but log the error
    //   console.error('Rate limit error:', error);
    //   next();
    // }
    
    // Allow all requests
    next();
  }

  private getLimitForRoute(path: string): number {
    if (path.includes('/auth/login')) return 10;
    if (path.includes('/auth/register')) return 5;
    if (path.includes('/upload')) return 20;
    if (path.includes('/search')) return 50;
    if (path.includes('/api')) return 100;
    return 60;
  }

  private getWindowForRoute(path: string): number {
    if (path.includes('/auth/login')) return 60;
    if (path.includes('/auth/register')) return 60;
    if (path.includes('/upload')) return 60;
    return 60;
  }
}