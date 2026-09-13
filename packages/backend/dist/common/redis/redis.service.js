"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = RedisService_1 = class RedisService {
    constructor(redisClient) {
        this.redisClient = redisClient;
        this.logger = new common_1.Logger(RedisService_1.name);
        this._isAvailable = true;
        this.setupEventListeners();
    }
    setupEventListeners() {
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
    isConnected() {
        return this.redisClient.status === 'ready' && this._isAvailable;
    }
    async get(key) {
        if (!this.isConnected())
            return null;
        try {
            return await this.redisClient.get(key);
        }
        catch (error) {
            this.logger.error(`Error getting key ${key}: ${error.message}`);
            return null;
        }
    }
    async set(key, value, ttl) {
        if (!this.isConnected())
            return;
        try {
            if (ttl) {
                await this.redisClient.setex(key, ttl, value);
            }
            else {
                await this.redisClient.set(key, value);
            }
        }
        catch (error) {
            this.logger.error(`Error setting key ${key}: ${error.message}`);
        }
    }
    async delete(key) {
        if (!this.isConnected())
            return;
        try {
            await this.redisClient.del(key);
        }
        catch (error) {
            this.logger.error(`Error deleting key ${key}: ${error.message}`);
        }
    }
    async del(key) {
        return this.delete(key);
    }
    async increment(key) {
        if (!this.isConnected())
            return 0;
        try {
            return await this.redisClient.incr(key);
        }
        catch (error) {
            this.logger.error(`Error incrementing key ${key}: ${error.message}`);
            return 0;
        }
    }
    async decrement(key) {
        if (!this.isConnected())
            return 0;
        try {
            return await this.redisClient.decr(key);
        }
        catch (error) {
            this.logger.error(`Error decrementing key ${key}: ${error.message}`);
            return 0;
        }
    }
    async expire(key, seconds) {
        if (!this.isConnected())
            return false;
        try {
            const result = await this.redisClient.expire(key, seconds);
            return result === 1;
        }
        catch (error) {
            this.logger.error(`Error setting expiry for key ${key}: ${error.message}`);
            return false;
        }
    }
    async ttl(key) {
        if (!this.isConnected())
            return -1;
        try {
            return await this.redisClient.ttl(key);
        }
        catch (error) {
            this.logger.error(`Error getting TTL for key ${key}: ${error.message}`);
            return -1;
        }
    }
    async exists(key) {
        if (!this.isConnected())
            return false;
        try {
            const result = await this.redisClient.exists(key);
            return result === 1;
        }
        catch (error) {
            this.logger.error(`Error checking key ${key}: ${error.message}`);
            return false;
        }
    }
    async sadd(key, member) {
        if (!this.isConnected())
            return 0;
        try {
            return await this.redisClient.sadd(key, member);
        }
        catch (error) {
            this.logger.error(`Error adding to set ${key}: ${error.message}`);
            return 0;
        }
    }
    async srem(key, member) {
        if (!this.isConnected())
            return 0;
        try {
            return await this.redisClient.srem(key, member);
        }
        catch (error) {
            this.logger.error(`Error removing from set ${key}: ${error.message}`);
            return 0;
        }
    }
    async scard(key) {
        if (!this.isConnected())
            return 0;
        try {
            return await this.redisClient.scard(key);
        }
        catch (error) {
            this.logger.error(`Error getting set size ${key}: ${error.message}`);
            return 0;
        }
    }
    async smembers(key) {
        if (!this.isConnected())
            return [];
        try {
            return await this.redisClient.smembers(key);
        }
        catch (error) {
            this.logger.error(`Error getting set members ${key}: ${error.message}`);
            return [];
        }
    }
    async flushAll() {
        if (!this.isConnected())
            return;
        try {
            await this.redisClient.flushall();
            this.logger.log('Redis cache cleared');
        }
        catch (error) {
            this.logger.error(`Error flushing Redis: ${error.message}`);
        }
    }
    async keys(pattern) {
        if (!this.isConnected())
            return [];
        try {
            return await this.redisClient.keys(pattern);
        }
        catch (error) {
            this.logger.error(`Error getting keys with pattern ${pattern}: ${error.message}`);
            return [];
        }
    }
    async isAvailable() {
        return this.isConnected();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [ioredis_1.default])
], RedisService);
