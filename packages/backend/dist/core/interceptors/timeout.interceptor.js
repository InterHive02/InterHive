"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let TimeoutInterceptor = class TimeoutInterceptor {
    constructor() {
        this.defaultTimeout = 30000;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const timeoutValue = this.getTimeoutValue(request);
        return next.handle().pipe((0, operators_1.timeout)(timeoutValue), (0, operators_1.catchError)((err) => {
            if (err instanceof rxjs_1.TimeoutError) {
                return (0, rxjs_1.throwError)(() => new common_1.RequestTimeoutException(`Request timed out after ${timeoutValue}ms`));
            }
            return (0, rxjs_1.throwError)(() => err);
        }));
    }
    getTimeoutValue(request) {
        const timeoutHeader = request.headers['x-timeout'];
        if (timeoutHeader) {
            const parsed = parseInt(timeoutHeader, 10);
            if (!isNaN(parsed) && parsed > 0) {
                return Math.min(parsed, 60000);
            }
        }
        const url = request.url;
        if (url.includes('/upload') || url.includes('/export')) {
            return 60000;
        }
        if (url.includes('/report') || url.includes('/analytics')) {
            return 45000;
        }
        return this.defaultTimeout;
    }
};
exports.TimeoutInterceptor = TimeoutInterceptor;
exports.TimeoutInterceptor = TimeoutInterceptor = __decorate([
    (0, common_1.Injectable)()
], TimeoutInterceptor);
