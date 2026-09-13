import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;
        const message = this.getStatusMessage(statusCode);

        // Check if response has pagination metadata
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
      }),
    );
  }

  private getStatusMessage(statusCode: number): string {
    const messages: Record<number, string> = {
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
}