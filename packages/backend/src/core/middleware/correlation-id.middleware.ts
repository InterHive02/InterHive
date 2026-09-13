import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../common/logger';

declare global {
  namespace Express {
    interface Request {
      correlationId: string;
    }
  }
}

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const correlationId = this.getCorrelationId(request);
    
    request.correlationId = correlationId;
    response.setHeader('X-Correlation-ID', correlationId);

    // Add correlation ID to logger context
    logger.setContext({ correlationId });

    next();
  }

  private getCorrelationId(request: Request): string {
    // Check if correlation ID is provided in headers
    const headerCorrelationId = request.headers['x-correlation-id'] as string;
    if (headerCorrelationId) {
      return headerCorrelationId;
    }

    // Check if request ID is provided in headers
    const requestId = request.headers['x-request-id'] as string;
    if (requestId) {
      return requestId;
    }

    // Generate new correlation ID
    return uuidv4();
  }
}