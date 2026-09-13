import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly defaultTimeout = 30000; // 30 seconds

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const timeoutValue = this.getTimeoutValue(request);

    return next.handle().pipe(
      timeout(timeoutValue),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException(
            `Request timed out after ${timeoutValue}ms`
          ));
        }
        return throwError(() => err);
      }),
    );
  }

  private getTimeoutValue(request: any): number {
    const timeoutHeader = request.headers['x-timeout'];
    if (timeoutHeader) {
      const parsed = parseInt(timeoutHeader, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return Math.min(parsed, 60000); // Max 60 seconds
      }
    }

    // Different timeouts based on endpoint
    const url = request.url;
    if (url.includes('/upload') || url.includes('/export')) {
      return 60000; // 60 seconds for upload/export
    }
    if (url.includes('/report') || url.includes('/analytics')) {
      return 45000; // 45 seconds for reports
    }

    return this.defaultTimeout;
  }
}