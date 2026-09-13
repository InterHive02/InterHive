"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        const errorResponse = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: this.getErrorMessage(exceptionResponse),
            error: this.getErrorDetails(exceptionResponse),
            correlationId: request['correlationId'] || null,
        };
        this.logger.error(`${request.method} ${request.url} - ${status} - ${errorResponse.message}`, exception.stack);
        response.status(status).json(errorResponse);
    }
    getErrorMessage(exceptionResponse) {
        if (typeof exceptionResponse === 'string') {
            return exceptionResponse;
        }
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const resp = exceptionResponse;
            if ('message' in resp) {
                const messages = resp['message'];
                if (Array.isArray(messages)) {
                    return messages.join(', ');
                }
                return String(messages);
            }
            if ('error' in resp) {
                return String(resp['error']);
            }
        }
        return 'An error occurred';
    }
    getErrorDetails(exceptionResponse) {
        if (typeof exceptionResponse === 'string') {
            return null;
        }
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const { message, statusCode, error, ...details } = exceptionResponse;
            return Object.keys(details).length > 0 ? details : null;
        }
        return null;
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
