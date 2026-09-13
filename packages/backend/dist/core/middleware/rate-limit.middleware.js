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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const redis_service_1 = require("../../common/redis/redis.service");
let RateLimitMiddleware = class RateLimitMiddleware {
    constructor(configService, redisService) {
        this.configService = configService;
        this.redisService = redisService;
    }
    async use(request, response, next) {
        next();
    }
    getLimitForRoute(path) {
        if (path.includes('/auth/login'))
            return 10;
        if (path.includes('/auth/register'))
            return 5;
        if (path.includes('/upload'))
            return 20;
        if (path.includes('/search'))
            return 50;
        if (path.includes('/api'))
            return 100;
        return 60;
    }
    getWindowForRoute(path) {
        if (path.includes('/auth/login'))
            return 60;
        if (path.includes('/auth/register'))
            return 60;
        if (path.includes('/upload'))
            return 60;
        return 60;
    }
};
exports.RateLimitMiddleware = RateLimitMiddleware;
exports.RateLimitMiddleware = RateLimitMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        redis_service_1.RedisService])
], RateLimitMiddleware);
