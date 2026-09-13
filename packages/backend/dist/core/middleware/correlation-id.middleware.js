"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelationIdMiddleware = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const logger_1 = require("../../common/logger");
let CorrelationIdMiddleware = class CorrelationIdMiddleware {
    use(request, response, next) {
        const correlationId = this.getCorrelationId(request);
        request.correlationId = correlationId;
        response.setHeader('X-Correlation-ID', correlationId);
        logger_1.logger.setContext({ correlationId });
        next();
    }
    getCorrelationId(request) {
        const headerCorrelationId = request.headers['x-correlation-id'];
        if (headerCorrelationId) {
            return headerCorrelationId;
        }
        const requestId = request.headers['x-request-id'];
        if (requestId) {
            return requestId;
        }
        return (0, uuid_1.v4)();
    }
};
exports.CorrelationIdMiddleware = CorrelationIdMiddleware;
exports.CorrelationIdMiddleware = CorrelationIdMiddleware = __decorate([
    (0, common_1.Injectable)()
], CorrelationIdMiddleware);
