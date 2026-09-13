import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
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

    // Log error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${errorResponse.message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(exceptionResponse: string | object): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resp = exceptionResponse as any;
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

  private getErrorDetails(exceptionResponse: string | object): any {
    if (typeof exceptionResponse === 'string') {
      return null;
    }

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const { message, statusCode, error, ...details } = exceptionResponse as any;
      return Object.keys(details).length > 0 ? details : null;
    }

    return null;
  }
}