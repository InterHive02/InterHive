"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Logger_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const common_1 = require("@nestjs/common");
const winston = __importStar(require("winston"));
const DailyRotateFileLib = __importStar(require("winston-daily-rotate-file"));
const DailyRotateFile = DailyRotateFileLib.default || DailyRotateFileLib;
const path = __importStar(require("path"));
let Logger = Logger_1 = class Logger {
    constructor() {
        this.initializeLogger();
    }
    initializeLogger() {
        const logDir = process.env.LOG_DIR || 'logs';
        const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston.format.printf(({ timestamp, level, message, context, correlationId, ...meta }) => {
            let log = `${timestamp} ${level} [${context || 'Application'}]`;
            if (correlationId) {
                log += ` [${correlationId}]`;
            }
            log += ` ${message}`;
            if (Object.keys(meta).length > 0) {
                log += ` ${JSON.stringify(meta)}`;
            }
            return log;
        }));
        const jsonFormat = winston.format.combine(winston.format.timestamp({ format: 'ISO' }), winston.format.json());
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            levels: {
                error: 0,
                warn: 1,
                info: 2,
                http: 3,
                verbose: 4,
                debug: 5,
                silly: 6,
            },
            transports: [
                new winston.transports.Console({
                    format: consoleFormat,
                    handleExceptions: true,
                }),
                new DailyRotateFile({
                    filename: path.join(logDir, 'error-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    level: 'error',
                    format: jsonFormat,
                    maxSize: '20m',
                    maxFiles: '30d',
                    handleExceptions: true,
                }),
                new DailyRotateFile({
                    filename: path.join(logDir, 'combined-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    format: jsonFormat,
                    maxSize: '20m',
                    maxFiles: '30d',
                    handleExceptions: true,
                }),
            ],
            exceptionHandlers: [
                new winston.transports.File({
                    filename: path.join(logDir, 'exceptions.log'),
                    format: jsonFormat,
                }),
            ],
            rejectionHandlers: [
                new winston.transports.File({
                    filename: path.join(logDir, 'rejections.log'),
                    format: jsonFormat,
                }),
            ],
        });
    }
    setContext(context) {
        this.context = context;
    }
    log(message, context) {
        this.logger.info(message, { context: context || this.context });
    }
    error(message, trace, context) {
        this.logger.error(message, { trace, context: context || this.context });
    }
    warn(message, context) {
        this.logger.warn(message, { context: context || this.context });
    }
    debug(message, context) {
        this.logger.debug(message, { context: context || this.context });
    }
    verbose(message, context) {
        this.logger.verbose(message, { context: context || this.context });
    }
    http(message, context) {
        this.logger.http(message, { context: context || this.context });
    }
    silly(message, context) {
        this.logger.silly(message, { context: context || this.context });
    }
    info(message, context) {
        this.logger.info(message, { context: context || this.context });
    }
    child(context) {
        const childLogger = new Logger_1();
        childLogger.setContext(context);
        return childLogger;
    }
    static create(context) {
        const logger = new Logger_1();
        if (context) {
            logger.setContext(context);
        }
        return logger;
    }
};
exports.Logger = Logger;
exports.Logger = Logger = Logger_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.TRANSIENT }),
    __metadata("design:paramtypes", [])
], Logger);
