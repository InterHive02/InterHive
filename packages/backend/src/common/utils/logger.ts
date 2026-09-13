import { Injectable, LoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFileLib from 'winston-daily-rotate-file';
const DailyRotateFile: any = (DailyRotateFileLib as any).default || DailyRotateFileLib;
import * as path from 'path';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger implements LoggerService {
  private logger: winston.Logger;
  private context: string;

  constructor() {
    this.initializeLogger();
  }

  private initializeLogger() {
    const logDir = process.env.LOG_DIR || 'logs';

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.printf(({ timestamp, level, message, context, correlationId, ...meta }) => {
        let log = `${timestamp} ${level} [${context || 'Application'}]`;
        if (correlationId) {
          log += ` [${correlationId}]`;
        }
        log += ` ${message}`;
        if (Object.keys(meta).length > 0) {
          log += ` ${JSON.stringify(meta)}`;
        }
        return log;
      }),
    );

    const jsonFormat = winston.format.combine(
      winston.format.timestamp({ format: 'ISO' }),
      winston.format.json(),
    );

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
        // Console transport
        new winston.transports.Console({
          format: consoleFormat,
          handleExceptions: true,
        }),

        // File transport for errors
        new DailyRotateFile({
          filename: path.join(logDir, 'error-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          format: jsonFormat,
          maxSize: '20m',
          maxFiles: '30d',
          handleExceptions: true,
        }),

        // File transport for all logs
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

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    this.logger.info(message, { context: context || this.context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, { trace, context: context || this.context });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context: context || this.context });
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, { context: context || this.context });
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message, { context: context || this.context });
  }

  http(message: any, context?: string) {
    this.logger.http(message, { context: context || this.context });
  }

  silly(message: any, context?: string) {
    this.logger.silly(message, { context: context || this.context });
  }

  info(message: any, context?: string) {
    this.logger.info(message, { context: context || this.context });
  }

  // Create a child logger with context
  child(context: string): Logger {
    const childLogger = new Logger();
    childLogger.setContext(context);
    return childLogger;
  }

  // Static method to create a logger instance
  static create(context?: string): Logger {
    const logger = new Logger();
    if (context) {
      logger.setContext(context);
    }
    return logger;
  }
}