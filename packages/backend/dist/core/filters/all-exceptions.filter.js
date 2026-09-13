"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const class_validator_1 = require("class-validator");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor() {
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = null;
        if (exception instanceof mongodb_1.MongoError) {
            const result = this.handleMongoError(exception);
            status = result.status;
            message = result.message;
            error = result.error;
        }
        else if (exception instanceof class_validator_1.ValidationError) {
            const result = this.handleValidationError(exception);
            status = result.status;
            message = result.message;
            error = result.error;
        }
        else if (exception instanceof Error) {
            status = this.getStatusFromError(exception);
            message = exception.message;
            error = {
                name: exception.name,
                stack: process.env.NODE_ENV === 'development' ? exception.stack : undefined,
            };
        }
        else {
            this.logger.error('Unknown error:', exception);
            message = 'An unexpected error occurred';
        }
        const errorResponse = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: message,
            error: error,
            correlationId: request['correlationId'] || null,
        };
        this.logger.error(`${request.method} ${request.url} - ${status} - ${message}`, exception.stack);
        response.status(status).json(errorResponse);
    }
    handleMongoError(error) {
        switch (error.code) {
            case 11000:
                return {
                    status: common_1.HttpStatus.CONFLICT,
                    message: 'Duplicate entry found',
                    error: {
                        code: error.code,
                        keyPattern: error['keyPattern'],
                        keyValue: error['keyValue'],
                    },
                };
            case 121:
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Document validation failed',
                    error: {
                        code: error.code,
                        message: error.message,
                    },
                };
            default:
                return {
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Database error occurred',
                    error: {
                        code: error.code,
                        message: error.message,
                    },
                };
        }
    }
    handleValidationError(error) {
        const messages = this.extractValidationMessages(error);
        return {
            status: common_1.HttpStatus.BAD_REQUEST,
            message: 'Validation failed',
            error: {
                errors: messages,
                details: error,
            },
        };
    }
    extractValidationMessages(error) {
        const messages = [];
        if (error.constraints) {
            messages.push(...Object.values(error.constraints));
        }
        if (error.children) {
            error.children.forEach(child => {
                messages.push(...this.extractValidationMessages(child));
            });
        }
        return messages;
    }
    getStatusFromError(error) {
        const errorMap = {
            'BadRequestException': common_1.HttpStatus.BAD_REQUEST,
            'UnauthorizedException': common_1.HttpStatus.UNAUTHORIZED,
            'ForbiddenException': common_1.HttpStatus.FORBIDDEN,
            'NotFoundException': common_1.HttpStatus.NOT_FOUND,
            'ConflictException': common_1.HttpStatus.CONFLICT,
            'RequestTimeoutException': common_1.HttpStatus.REQUEST_TIMEOUT,
            'TooManyRequestsException': common_1.HttpStatus.TOO_MANY_REQUESTS,
            'InternalServerErrorException': common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        };
        return errorMap[error.name] || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
