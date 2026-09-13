"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.map)((data) => {
            const statusCode = response.statusCode;
            const message = this.getStatusMessage(statusCode);
            const hasPagination = data?.data && data?.meta;
            if (hasPagination) {
                return {
                    success: true,
                    message: data.message || message,
                    data: data.data,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        page: data.meta.page,
                        limit: data.meta.limit,
                        total: data.meta.total,
                        totalPages: data.meta.totalPages,
                    },
                };
            }
            return {
                success: true,
                message: data?.message || message,
                data: data?.data || data,
                timestamp: new Date().toISOString(),
            };
        }));
    }
    getStatusMessage(statusCode) {
        const messages = {
            200: 'Request successful',
            201: 'Resource created successfully',
            202: 'Request accepted for processing',
            204: 'Resource deleted successfully',
            400: 'Bad request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Resource not found',
            409: 'Conflict',
            422: 'Validation error',
            500: 'Internal server error',
        };
        return messages[statusCode] || 'Request processed successfully';
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
