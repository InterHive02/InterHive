import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { ValidationError } from 'class-validator';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = null;

    // Handle different types of errors
    if (exception instanceof MongoError) {
      const result = this.handleMongoError(exception);
      status = result.status;
      message = result.message;
      error = result.error;
    } else if (exception instanceof ValidationError) {
      const result = this.handleValidationError(exception);
      status = result.status;
      message = result.message;
      error = result.error;
    } else if (exception instanceof Error) {
      status = this.getStatusFromError(exception);
      message = exception.message;
      error = {
        name: exception.name,
        stack: process.env.NODE_ENV === 'development' ? exception.stack : undefined,
      };
    } else {
      // Unknown error
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

    // Log error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }

  private handleMongoError(error: MongoError): { status: number; message: string; error: any } {
    switch (error.code) {
      case 11000: // Duplicate key error
        return {
          status: HttpStatus.CONFLICT,
          message: 'Duplicate entry found',
          error: {
            code: error.code,
            keyPattern: error['keyPattern'],
            keyValue: error['keyValue'],
          },
        };
      case 121: // Document validation error
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Document validation failed',
          error: {
            code: error.code,
            message: error.message,
          },
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error occurred',
          error: {
            code: error.code,
            message: error.message,
          },
        };
    }
  }

  private handleValidationError(error: ValidationError): { status: number; message: string; error: any } {
    const messages = this.extractValidationMessages(error);
    return {
      status: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      error: {
        errors: messages,
        details: error,
      },
    };
  }

  private extractValidationMessages(error: ValidationError): string[] {
    const messages: string[] = [];

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

  private getStatusFromError(error: Error): number {
    // Map common error types to HTTP status codes
    const errorMap: Record<string, number> = {
      'BadRequestException': HttpStatus.BAD_REQUEST,
      'UnauthorizedException': HttpStatus.UNAUTHORIZED,
      'ForbiddenException': HttpStatus.FORBIDDEN,
      'NotFoundException': HttpStatus.NOT_FOUND,
      'ConflictException': HttpStatus.CONFLICT,
      'RequestTimeoutException': HttpStatus.REQUEST_TIMEOUT,
      'TooManyRequestsException': HttpStatus.TOO_MANY_REQUESTS,
      'InternalServerErrorException': HttpStatus.INTERNAL_SERVER_ERROR,
    };

    return errorMap[error.name] || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}