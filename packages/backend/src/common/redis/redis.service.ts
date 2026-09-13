import { Injectable, Inject, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private _isAvailable = true;

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.redisClient.on('connect', () => {
      this.logger.log('✅ Redis connected successfully');
      this._isAvailable = true;
    });

    this.redisClient.on('error', (error) => {
      this.logger.error(`❌ Redis error: ${error.message}`);
      this._isAvailable = false;
    });

    this.redisClient.on('close', () => {
      this.logger.warn('⚠️ Redis connection closed');
      this._isAvailable = false;
    });

    this.redisClient.on('reconnecting', () => {
      this.logger.log('🔄 Redis reconnecting...');
    });
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    this.logger.log('Redis connection closed');
  }

  isConnected(): boolean {
    return this.redisClient.status === 'ready' && this._isAvailable;
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected()) return null;
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      this.logger.error(`Error getting key ${key}: ${error.message}`);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.isConnected()) return;
    try {
      if (ttl) {
        await this.redisClient.setex(key, ttl, value);
      } else {
        await this.redisClient.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key}: ${error.message}`);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.isConnected()) return;
    try {
      await this.redisClient.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}: ${error.message}`);
    }
  }

  async del(key: string): Promise<void> {
    return this.delete(key);
  }

  async increment(key: string): Promise<number> {
    if (!this.isConnected()) return 0;
    try {
      return await this.redisClient.incr(key);
    } catch (error) {
      this.logger.error(`Error incrementing key ${key}: ${error.message}`);
      return 0;
    }
  }

  async decrement(key: string): Promise<number> {
    if (!this.isConnected()) return 0;
    try {
      return await this.redisClient.decr(key);
    } catch (error) {
      this.logger.error(`Error decrementing key ${key}: ${error.message}`);
      return 0;
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.isConnected()) return false;
    try {
      const result = await this.redisClient.expire(key, seconds);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error setting expiry for key ${key}: ${error.message}`);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.isConnected()) return -1;
    try {
      return await this.redisClient.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting TTL for key ${key}: ${error.message}`);
      return -1;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected()) return false;
    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking key ${key}: ${error.message}`);
      return false;
    }
  }

  async sadd(key: string, member: string): Promise<number> {
    if (!this.isConnected()) return 0;
    try {
      return await this.redisClient.sadd(key, member);
    } catch (error) {
      this.logger.error(`Error adding to set ${key}: ${error.message}`);
      return 0;
    }
  }

  async srem(key: string, member: string): Promise<number> {
    if (!this.isConnected()) return 0;
    try {
      return await this.redisClient.srem(key, member);
    } catch (error) {
      this.logger.error(`Error removing from set ${key}: ${error.message}`);
      return 0;
    }
  }

  async scard(key: string): Promise<number> {
    if (!this.isConnected()) return 0;
    try {
      return await this.redisClient.scard(key);
    } catch (error) {
      this.logger.error(`Error getting set size ${key}: ${error.message}`);
      return 0;
    }
  }

  async smembers(key: string): Promise<string[]> {
    if (!this.isConnected()) return [];
    try {
      return await this.redisClient.smembers(key);
    } catch (error) {
      this.logger.error(`Error getting set members ${key}: ${error.message}`);
      return [];
    }
  }

  async flushAll(): Promise<void> {
    if (!this.isConnected()) return;
    try {
      await this.redisClient.flushall();
      this.logger.log('Redis cache cleared');
    } catch (error) {
      this.logger.error(`Error flushing Redis: ${error.message}`);
    }
  }

  async keys(pattern: string): Promise<string[]> {
    if (!this.isConnected()) return [];
    try {
      return await this.redisClient.keys(pattern);
    } catch (error) {
      this.logger.error(`Error getting keys with pattern ${pattern}: ${error.message}`);
      return [];
    }
  }

  async isAvailable(): Promise<boolean> {
    return this.isConnected();
  }
}