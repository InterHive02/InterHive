import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    // Log request
    this.logger.log(
      `📥 ${method} ${originalUrl} - ${ip} - ${userAgent}`
    );

    // Log response
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length') || 0;
      const duration = Date.now() - startTime;

      const statusColor = statusCode >= 500 ? '🔴' :
                         statusCode >= 400 ? '🟡' :
                         statusCode >= 300 ? '🟠' : '🟢';

      this.logger.log(
        `${statusColor} ${method} ${originalUrl} - ${statusCode} - ${contentLength} bytes - ${duration}ms`
      );
    });

    // Log errors
    response.on('error', (error) => {
      this.logger.error(
        `❌ ${method} ${originalUrl} - Error: ${error.message}`
      );
    });

    next();
  }
}